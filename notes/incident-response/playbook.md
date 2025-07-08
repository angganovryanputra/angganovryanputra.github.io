---
title: "Incident Response Playbook"
author: "CSIRT Team"
date: "2024-01-25"
category: "Incident Response"
tags: ["incident-response", "playbook", "containment", "forensics"]
---

# Incident Response Playbook

## Preparation Phase

### Team Structure and Roles

#### Incident Commander
- **Responsibilities**: Overall response coordination and decision-making
- **Authority**: Resource allocation and external communication approval
- **Skills Required**: Leadership, communication, technical understanding
- **Contact Information**: 24/7 availability with multiple contact methods

#### Security Analyst
- **Responsibilities**: Technical investigation and analysis
- **Tasks**: Log analysis, forensic examination, threat assessment
- **Tools**: SIEM, forensic software, analysis platforms
- **Expertise**: Malware analysis, network forensics, system administration

#### Communications Lead
- **Responsibilities**: Internal and external communications
- **Stakeholders**: Management, legal, customers, media, regulators
- **Templates**: Pre-approved communication templates
- **Channels**: Multiple communication methods and backup systems

#### Legal Counsel
- **Responsibilities**: Legal and regulatory compliance
- **Areas**: Data breach laws, evidence handling, regulatory requirements
- **Contacts**: External legal firms, regulatory bodies
- **Documentation**: Legal hold procedures, compliance checklists

### Tools and Resources

#### Incident Response Toolkit
- **Forensic Imaging**: dd, FTK Imager, EnCase
- **Memory Analysis**: Volatility, Rekall, WinPmem
- **Network Analysis**: Wireshark, tcpdump, NetworkMiner
- **Malware Analysis**: IDA Pro, Ghidra, Cuckoo Sandbox

#### Communication Systems
- **Primary**: Secure messaging platform (Signal, Element)
- **Secondary**: Conference bridge with dial-in numbers
- **Emergency**: Satellite phones for critical situations
- **Documentation**: Shared workspace for real-time collaboration

## Detection and Analysis

### Initial Detection Sources

#### Security Monitoring
- **SIEM Alerts**: Correlation rules and anomaly detection
- **IDS/IPS**: Network intrusion detection systems
- **EDR**: Endpoint detection and response platforms
- **Log Analysis**: Centralized logging and analysis

#### User Reports
- **Phishing Reports**: Suspicious email notifications
- **System Issues**: Performance problems or unusual behavior
- **Data Concerns**: Unauthorized access or data exposure
- **Social Engineering**: Suspicious phone calls or requests

### Triage Process

#### Initial Assessment (15 minutes)
1. **Verify the Incident**: Confirm legitimate security event
2. **Classify Severity**: Use predefined severity matrix
3. **Assign Resources**: Allocate appropriate team members
4. **Establish Timeline**: Set initial response milestones

#### Severity Classification
- **Critical**: System compromise, data breach, service outage
- **High**: Attempted breach, malware infection, policy violation
- **Medium**: Suspicious activity, minor security event
- **Low**: False positive, informational alert

### Evidence Collection

#### Digital Forensics
\`\`\`bash
# Create forensic image
dd if=/dev/sda of=/mnt/evidence/disk_image.dd bs=4096 conv=noerror,sync

# Calculate hash for integrity
sha256sum /mnt/evidence/disk_image.dd > /mnt/evidence/disk_image.sha256

# Memory dump acquisition
sudo ./linpmem-2.1.post4 /mnt/evidence/memory.aff4

# Network packet capture
tcpdump -i eth0 -w /mnt/evidence/network_capture.pcap
\`\`\`

#### Chain of Custody
- **Documentation**: Detailed evidence handling log
- **Storage**: Secure, tamper-evident storage
- **Access Control**: Limited access with audit trail
- **Transportation**: Secure transfer procedures

## Containment, Eradication, and Recovery

### Short-term Containment

#### Network Isolation
- **System Quarantine**: Isolate affected systems from network
- **Network Segmentation**: Implement additional network controls
- **Access Restriction**: Disable compromised accounts
- **Traffic Blocking**: Block malicious IP addresses and domains

#### Evidence Preservation
\`\`\`bash
# Create system snapshot
virsh snapshot-create-as vm_name snapshot_name

# Preserve volatile data
ps aux > /evidence/running_processes.txt
netstat -tulpn > /evidence/network_connections.txt
lsof > /evidence/open_files.txt
\`\`\`

### Long-term Containment

#### System Hardening
- **Patch Management**: Apply security updates
- **Configuration Changes**: Implement security configurations
- **Access Controls**: Strengthen authentication and authorization
- **Monitoring Enhancement**: Increase logging and monitoring

#### Threat Intelligence
- **IOC Analysis**: Indicators of compromise research
- **Attribution**: Threat actor identification
- **TTPs**: Tactics, techniques, and procedures analysis
- **Threat Landscape**: Current threat environment assessment

### Eradication

#### Malware Removal
\`\`\`bash
# Scan for malware
clamscan -r --infected --remove /

# Remove persistence mechanisms
crontab -l | grep -v malicious_script | crontab -
systemctl disable malicious_service
\`\`\`

#### Vulnerability Remediation
- **Patch Installation**: Apply security patches
- **Configuration Fixes**: Correct misconfigurations
- **Access Revocation**: Remove unauthorized access
- **System Rebuilding**: Complete system reconstruction if necessary

### Recovery

#### System Restoration
- **Clean Backups**: Restore from verified clean backups
- **System Validation**: Verify system integrity and functionality
- **Gradual Restoration**: Phased return to normal operations
- **Monitoring**: Enhanced monitoring during recovery phase

#### Business Continuity
- **Service Restoration**: Prioritize critical business functions
- **User Communication**: Inform users of service status
- **Performance Monitoring**: Ensure system performance
- **Backup Verification**: Confirm backup system functionality

## Communication and Documentation

### Internal Communication

#### Stakeholder Notifications
- **Management**: Executive briefings and status updates
- **IT Teams**: Technical coordination and resource allocation
- **Business Units**: Impact assessment and recovery planning
- **Legal/Compliance**: Regulatory and legal implications

#### Communication Templates
\`\`\`
INCIDENT NOTIFICATION
Incident ID: INC-2024-001
Severity: HIGH
Status: ACTIVE
Summary: Suspected malware infection on critical server
Impact: Email services degraded
Actions: Containment in progress, investigation ongoing
Next Update: 2 hours
Contact: incident-commander@company.com
\`\`\`

### External Communication

#### Regulatory Reporting
- **Timeline Requirements**: Notification deadlines
- **Required Information**: Specific data elements
- **Submission Methods**: Approved reporting channels
- **Follow-up Requirements**: Additional reporting obligations

#### Customer Notification
- **Breach Notification**: Data breach disclosure requirements
- **Service Impact**: Service availability and performance
- **Remediation Steps**: Actions taken to address incident
- **Prevention Measures**: Steps to prevent recurrence

## Post-Incident Activities

### Lessons Learned

#### After-Action Review
- **Timeline Analysis**: Detailed incident timeline
- **Response Effectiveness**: What worked well
- **Improvement Areas**: What could be improved
- **Resource Adequacy**: Staffing and tool effectiveness

#### Process Improvements
- **Playbook Updates**: Revise procedures based on experience
- **Tool Enhancements**: Improve detection and response capabilities
- **Training Needs**: Identify skill gaps and training requirements
- **Communication Improvements**: Enhance notification procedures

### Metrics and KPIs

#### Response Metrics
- **Mean Time to Detection (MTTD)**: Average time to identify incidents
- **Mean Time to Response (MTTR)**: Average time to begin response
- **Mean Time to Recovery (MTTR)**: Average time to restore services
- **False Positive Rate**: Percentage of false alarms

#### Effectiveness Metrics
- **Containment Success**: Percentage of successful containments
- **Recovery Time**: Time to full operational recovery
- **Cost Impact**: Financial impact of incidents
- **Stakeholder Satisfaction**: Internal and external satisfaction ratings

## Legal and Regulatory Considerations

### Data Breach Laws
- **GDPR**: European Union data protection regulation
- **CCPA**: California Consumer Privacy Act
- **HIPAA**: Health Insurance Portability and Accountability Act
- **SOX**: Sarbanes-Oxley Act requirements

### Evidence Handling
- **Chain of Custody**: Proper evidence documentation
- **Legal Hold**: Preservation of relevant documents
- **Expert Testimony**: Preparation for legal proceedings
- **Disclosure Requirements**: Legal and regulatory disclosure obligations

## Conclusion

Effective incident response requires preparation, coordination, and continuous improvement. This playbook provides a framework for responding to security incidents while ensuring legal compliance and business continuity.
