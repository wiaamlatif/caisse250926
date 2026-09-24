<?php
$idTicket = filter_input(INPUT_GET, 'idTicket', FILTER_VALIDATE_INT);
if ($idTicket === false || $idTicket === null) {
    http_response_code(400);
    exit('Missing ticket number.');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket <?= htmlspecialchars((string) $idTicket, ENT_QUOTES, 'UTF-8') ?></title>
  <style>
    @page { size: 80mm auto; margin: 0; }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 80mm; }
    body {
      background: #fff;
      color: #000;
      font-family: "Courier New", Courier, monospace;
      font-size: 12px;
      font-weight: 600;
    }
    .receipt {
      width: 72mm;
      margin: 0 auto;
      padding: 4mm 0;
    }
    .receipt-header, .receipt-footer { text-align: center; }
    .business-name { font-size: 18px; font-weight: 700; }
    .business-line { line-height: 1.35; }
    .rule { border-top: 1px solid #000; margin: 3mm 0; }
    .ticket-lines { width: 100%; border-collapse: collapse; table-layout: fixed; }
    .ticket-lines td { padding: 1mm 0; vertical-align: top; }
    .line-qty { width: 18mm; white-space: nowrap; }
    .line-name { width: auto; padding-right: 1mm !important; overflow-wrap: anywhere; }
    .line-total { width: 16mm; text-align: right; white-space: nowrap; }
    .total-row { display: flex; justify-content: flex-end; gap: 3mm; font-size: 15px; }
    .receipt-footer div { line-height: 1.5; }
    .paper-feed { line-height: 1.5; }

    @media screen {
      body { margin: 12px auto; border: 1px solid #ddd; }
    }
    @media print {
      .receipt { padding-top: 2mm; }     
    }
  </style>
</head>
<body>
  <main class="receipt">
    <header id="showHeadTicket" class="receipt-header"></header>
    <div class="rule"></div>
    <table class="ticket-lines" aria-label="Ticket items">
      <tbody id="showDetailTicket"></tbody>
    </table>
    <div class="rule"></div>
    <footer id="showFootTicket" class="receipt-footer"></footer>
  </main>

  <script src="asset/js/test.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      printTicket(<?= (int) $idTicket ?>);
    });
  </script>
</body>
</html>
