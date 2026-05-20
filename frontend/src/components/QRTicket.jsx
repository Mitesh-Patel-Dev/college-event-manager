import { QRCodeCanvas } from "qrcode.react";
import { FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import "./QRTicket.css";

export default function QRTicket({ registration, user }) {
  const { event, _id } = registration;
  
  if (!event) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  // Data encoded in QR: Registration ID + Event ID + Student Roll No for validation
  const qrData = JSON.stringify({
    regId: _id,
    eventId: event._id,
    roll: user?.rollNumber || user?.email
  });

  return (
    <div className="qr-ticket glass-card">
      <div className="qr-ticket-left">
        <div className="qr-ticket-header">
          <span className="badge badge-blue">{event.category}</span>
          <span className="qr-ticket-id">#{_id.slice(-6).toUpperCase()}</span>
        </div>
        
        <h3 className="qr-ticket-title">{event.title}</h3>
        
        <div className="qr-ticket-details">
          <div className="qr-ticket-detail">
            <FiCalendar size={14} className="qr-icon" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="qr-ticket-detail">
            <FiClock size={14} className="qr-icon" />
            <span>{event.time}</span>
          </div>
          <div className="qr-ticket-detail">
            <FiMapPin size={14} className="qr-icon" />
            <span>{event.venue}</span>
          </div>
        </div>
        
        <div className="qr-ticket-user">
          <div className="qr-user-avatar">
            <FiUser size={14} />
          </div>
          <div className="qr-user-info">
            <span className="qr-user-name">{user?.name}</span>
            <span className="qr-user-roll">{user?.rollNumber || user?.email}</span>
          </div>
        </div>
      </div>
      
      <div className="qr-ticket-divider">
        <div className="qr-notch top"></div>
        <div className="qr-dash-line"></div>
        <div className="qr-notch bottom"></div>
      </div>
      
      <div className="qr-ticket-right">
        <div className="qr-code-wrapper">
          <QRCodeCanvas 
            value={qrData} 
            size={120} 
            bgColor={"#ffffff"} 
            fgColor={"#11111b"} 
            level={"H"}
            includeMargin={true}
            style={{ borderRadius: "8px" }}
          />
        </div>
        <span className="qr-scan-text">SCAN FOR ENTRY</span>
      </div>
    </div>
  );
}
