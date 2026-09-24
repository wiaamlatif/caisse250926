<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'POST required']);
    exit;
}

$request = json_decode(file_get_contents('php://input'), true);
if (isset($request['idTicket'])) {
    require './printPos80Ticket.php';
    exit;
}

$printerName = 'POS-80';
$script = <<<'POWERSHELL'
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public static class RawPrinter {
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public class DOCINFO {
        [MarshalAs(UnmanagedType.LPWStr)] public string pDocName;
        [MarshalAs(UnmanagedType.LPWStr)] public string pOutputFile;
        [MarshalAs(UnmanagedType.LPWStr)] public string pDataType;
    }

    [DllImport("winspool.drv", SetLastError = true, CharSet = CharSet.Unicode)]
    static extern bool OpenPrinter(string pPrinterName, out IntPtr phPrinter, IntPtr pDefault);
    [DllImport("winspool.drv", SetLastError = true)]
    static extern bool ClosePrinter(IntPtr hPrinter);
    [DllImport("winspool.drv", SetLastError = true, CharSet = CharSet.Unicode)]
    static extern int StartDocPrinter(IntPtr hPrinter, int level, DOCINFO di);
    [DllImport("winspool.drv", SetLastError = true)]
    static extern bool EndDocPrinter(IntPtr hPrinter);
    [DllImport("winspool.drv", SetLastError = true)]
    static extern bool StartPagePrinter(IntPtr hPrinter);
    [DllImport("winspool.drv", SetLastError = true)]
    static extern bool EndPagePrinter(IntPtr hPrinter);
    [DllImport("winspool.drv", SetLastError = true)]
    static extern bool WritePrinter(IntPtr hPrinter, byte[] bytes, int count, out int written);

    public static void Send(string printerName, byte[] bytes) {
        IntPtr printer;
        if (!OpenPrinter(printerName, out printer, IntPtr.Zero))
            throw new Exception("Cannot open printer: " + printerName);

        try {
            DOCINFO info = new DOCINFO();
            info.pDocName = "POS-80 feed";
            info.pDataType = "RAW";
            if (StartDocPrinter(printer, 1, info) == 0) throw new Exception("Cannot start print job");
            try {
                if (!StartPagePrinter(printer)) throw new Exception("Cannot start print page");
                try {
                    int written;
                    if (!WritePrinter(printer, bytes, bytes.Length, out written) || written != bytes.Length)
                        throw new Exception("Cannot write to printer");
                } finally { EndPagePrinter(printer); }
            } finally { EndDocPrinter(printer); }
        } finally { ClosePrinter(printer); }
    }
}
'@
[RawPrinter]::Send('__PRINTER__', [byte[]](0x1B, 0x64, 0x01))
POWERSHELL;
$script = '$ProgressPreference = \'SilentlyContinue\'' . "\r\n" . $script;

$script = str_replace('__PRINTER__', str_replace("'", "''", $printerName), $script);
$encodedCommand = base64_encode(mb_convert_encoding($script, 'UTF-16LE', 'UTF-8'));
$powershell = getenv('WINDIR') . '\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
$command = escapeshellarg($powershell) . ' -NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand ' . $encodedCommand;
$outputLines = [];
$exitCode = 0;
exec($command . ' 2>&1', $outputLines, $exitCode);
$output = implode(PHP_EOL, $outputLines);

if ($exitCode === 0) {
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(500);
echo json_encode(
    ['ok' => false, 'error' => trim((string) $output) ?: 'The printer command failed.'],
    JSON_INVALID_UTF8_SUBSTITUTE
);
