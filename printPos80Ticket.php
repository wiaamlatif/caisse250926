<?php
require_once './database.php';

$request = json_decode(file_get_contents('php://input'), true);
$idTicket = filter_var($request['idTicket'] ?? null, FILTER_VALIDATE_INT);
if ($idTicket === false || $idTicket === null || $idTicket < 1) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid ticket number']);
    exit;
}

$ticketStatement = $conn->prepare(
    'SELECT tickets.nr_ticket, tickets.total_ticket, tickets.id_user, users.first_name
     FROM tickets INNER JOIN users ON tickets.id_user = users.id_user
     WHERE tickets.id_ticket = ?'
);
$ticketStatement->bind_param('i', $idTicket);
$ticketStatement->execute();
$ticket = $ticketStatement->get_result()->fetch_assoc();
$ticketStatement->close();

if (!$ticket) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'error' => 'Ticket not found']);
    exit;
}

$lineStatement = $conn->prepare(
    'SELECT products.name_product, lignes_ticket.quantity, products.price
     FROM lignes_ticket INNER JOIN products ON lignes_ticket.id_product = products.id_product
     WHERE lignes_ticket.id_ticket = ? ORDER BY lignes_ticket.indexRowTicket ASC'
);
$lineStatement->bind_param('i', $idTicket);
$lineStatement->execute();
$lines = $lineStatement->get_result()->fetch_all(MYSQLI_ASSOC);
$lineStatement->close();

function pos80Text(string $text): string {
    $converted = iconv('UTF-8', 'CP437//TRANSLIT//IGNORE', $text);
    return $converted === false ? '' : $converted;
}

function pos80Line(string $text = ''): string {
    return pos80Text($text) . "\n";
}

$printData = "\x1B\x40\x1B\x61\x01";

$printData .= "\x1B\x45\x01"."\x1D\x21\x11";
$printData .= pos80Line('CAFE LA PASSERELLE');

$printData .= "\x1B\x45\x00"."\x1B\x21\x00"; 
$printData .= pos80Line('22, Rue Al Alloussi');
$printData .= pos80Line('Casablanca');
$printData .= pos80Line('05.29.53.91.82');
$printData .= pos80Line('Serveur : '.$ticket['id_user'].'-'.$ticket['first_name']);
$printData .= pos80Line(str_repeat('-', 48));
$printData .= "\x1B\x61\x01"."\x1B\x4D\x00"."\x1D\x21\x00";

foreach ($lines as $line) {
    $quantity = (int) $line['quantity'];
    $totalItem = $quantity * (float) $line['price'];
    $name = substr(pos80Text((string) $line['name_product']), 0, 28);
    $printData .= pos80Line(sprintf('%dx %-28s %7.2f', $quantity, $name, $totalItem));
}

$printData .= pos80Line(str_repeat('-', 48));

$printData .= "\x1B\x61\x00"."\x1B\x4D\x00"."\x1B\x45\x01"."\x1D\x21\x01";
$printData .= pos80Line(str_repeat(' ', 30).'Total :'.sprintf('%7.2f',(float) $ticket['total_ticket']));
$printData .= "\x1B\x45\x00"."\x1D\x21\x00";

$printData .= pos80Line('Ticket : ' . $ticket['nr_ticket']);
$printData .= pos80Line(date('d/m/Y H:i'));
$printData .= pos80Line('Code Wifi : 20252030') . "\n\x1B\x64\x01";

for ($x = 0; $x < 10 ; $x++) {
 $printData .= pos80Line(str_repeat('', 48));
}

$printerName = 'POS-80';
$payload = base64_encode($printData);
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
    [DllImport("winspool.drv", SetLastError = true, CharSet = CharSet.Unicode)] static extern bool OpenPrinter(string n, out IntPtr p, IntPtr d);
    [DllImport("winspool.drv", SetLastError = true)] static extern bool ClosePrinter(IntPtr p);
    [DllImport("winspool.drv", SetLastError = true, CharSet = CharSet.Unicode)] static extern int StartDocPrinter(IntPtr p, int l, DOCINFO i);
    [DllImport("winspool.drv", SetLastError = true)] static extern bool EndDocPrinter(IntPtr p);
    [DllImport("winspool.drv", SetLastError = true)] static extern bool StartPagePrinter(IntPtr p);
    [DllImport("winspool.drv", SetLastError = true)] static extern bool EndPagePrinter(IntPtr p);
    [DllImport("winspool.drv", SetLastError = true)] static extern bool WritePrinter(IntPtr p, byte[] b, int c, out int w);
    public static void Send(string n, byte[] b) {
        IntPtr p;
        if (!OpenPrinter(n, out p, IntPtr.Zero)) throw new Exception("Cannot open printer: " + n);
        try {
            DOCINFO i = new DOCINFO(); i.pDocName = "POS-80 ticket"; i.pDataType = "RAW";
            if (StartDocPrinter(p, 1, i) == 0) throw new Exception("Cannot start print job");
            try {
                if (!StartPagePrinter(p)) throw new Exception("Cannot start print page");
                try { int w; if (!WritePrinter(p, b, b.Length, out w) || w != b.Length) throw new Exception("Cannot write to printer"); }
                finally { EndPagePrinter(p); }
            } finally { EndDocPrinter(p); }
        } finally { ClosePrinter(p); }
    }
}
'@
[RawPrinter]::Send('__PRINTER__', [Convert]::FromBase64String('__PAYLOAD__'))
POWERSHELL;
$script = '$ProgressPreference = \'SilentlyContinue\'' . "\r\n" . $script;

$script = str_replace('__PRINTER__', str_replace("'", "''", $printerName), $script);
$script = str_replace('__PAYLOAD__', $payload, $script);
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
