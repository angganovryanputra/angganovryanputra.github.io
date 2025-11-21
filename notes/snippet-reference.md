---
title: "Markdown Snippet Reference"
date: "2024-01-10"
category: "guides"
tags: ["markdown", "snippets", "renderer"]
description: "Contoh snippet markdown yang didukung oleh renderer statis."
cover: "https://placehold.co/1200x630/111827/34d399.png?text=Markdown+Snippet"
---

# Markdown Snippet Reference

Dokumen ini menampilkan contoh-contoh snippet yang sekarang didukung renderer.

## 1. Code Fence Standar

```
System check complete.
No anomalies detected.
```

## 2. Code Fence dengan Bahasa

```bash
#!/bin/bash
echo "Scanning endpoints..."
```

```python
def classify_alert(event):
    if event.severity >= 8:
        return "CRITICAL"
    return "NORMAL"
```

## 3. Code Fence Gaya Obsidian

```bash
ps aux | grep suspicious_process
```

```
[ALERT] Unknown activity detected.
Initiating investigation sequence.
```

## 4. Code Fence dengan Metadata

```yaml title="Incident Metadata" showLineNumbers
incident:
  id: IR-2025-007
  owner: soc-team
  status: active
  severity: high
```

```sql title="Query: recent logins" numberLines
SELECT username, source_ip, login_time
FROM audit_logins
WHERE login_time > NOW() - INTERVAL '1 day';
```

## 5. Callout Blocks

> [!info] Detection Pipeline
> Data ingested from sensors is enriched and scored.

> [!warning]
> Unusual lateral movement detected across segmented networks.

> [!tip] Threat Hunting
> Build hypotheses menggunakan MITRE ATT&CK dan validasi dengan telemetry.

> [!danger] Immediate Action Required
> Containment harus dimulai dalam 15 menit.

## 6. Inline Code

Jalankan pemindaian dengan `python run_scan.py --mode=deep` lalu review report yang dihasilkan.

## 7. Tabel Berisi Code

| Tool        | Perintah                                   | Tujuan                |
| ----------- | ------------------------------------------ | --------------------- |
| **netstat** | `netstat -anp | grep 443`                  | Melihat koneksi TLS   |
| **lsof**    | `lsof -i :8080`                            | Menemukan PID yang aktif |
| **nmap**    | `nmap -sV --script=vuln target.example`    | Probing exposure      |

## 8. Contoh Campuran

> [!note] Investigation Notes
> - Host: `workstation-33`
> - Trigger: EDR alert
> - Artefak: memory dump, process tree
>
> ```powershell title="Collection Script"
> Get-Process | Where-Object {$_.Id -eq $env:PID}
> Get-WinEvent -LogName Security -MaxEvents 25
> ```

## 9. Link dalam Code Block

```text
Refer to runbook: https://intranet.secops.local/runbooks/incident-response
```

## 10. Callout dengan List

> [!success] Containment Checklist
> 1. Disable affected accounts.
> 2. Isolasi sistem terdampak.
> 3. Deploy aturan deteksi terbaru.
