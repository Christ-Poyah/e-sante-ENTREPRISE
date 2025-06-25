import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Stethoscope, 
  UserCircle2, 
  ClipboardList, 
  Brain, 
  Activity, 
  Box, 
  Shield, 
  Settings,
  ChevronDown,
  Users,
  FileText,
  Bell,
  Globe
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();
  const hasChildren = children && children.length > 0;

  // Map des labels vers les routes
  const routeMap = {
    "Nouvelle consultation": "/consultation/new",
    "Historique": "/consultation/history",
    "Rendez-vous": "/consultation/appointments",
    "Liste des patients": "/patients/list",
    "Jumeau numérique": "/patients/digital-twin",
    "Suivi patients": "/patients/monitoring",
    "Nouvelle ordonnance": "/prescriptions/new",
    "Historique": "/prescriptions/history",
    "Pharmacies": "/prescriptions/pharmacies",
    "Signes vitaux": "/monitoring/vital-signs",
    "Téléconsultation": "/monitoring/teleconsultation",
    "Alertes": "/monitoring/alerts",
    "Langue": "/localization/language",
    "Mode hors-ligne": "/localization/offline",
    "Spécificités régionales": "/localization/regional",
    "Chiffrement": "/security/encryption",
    "Audit": "/security/audit",
    "Sauvegardes": "/security/backup",
    "Thème": "/settings/theme",
    "Accessibilité": "/settings/accessibility",
    "Personnalisation": "/settings/customization"
  };

  return (
    <div className="mb-2">
      <div 
        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer text-gray-700 hover:bg-blue-50 ${hasChildren ? 'justify-between' : ''}`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </div>
        {hasChildren && (
          <ChevronDown className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </div>
      {isOpen && hasChildren && (
        <div className="ml-9 mt-1">
          {children.map((child, index) => (
            <Link 
              key={index}
              to={routeMap[child]}
              className={`block py-2 px-4 text-sm ${
                location.pathname === routeMap[child]
                  ? 'text-blue-600 bg-blue-50 rounded-lg'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {child}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen shadow-lg p-6 overflow-y-auto">
      <Link to="/dashboard" className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
          <UserCircle2 className="w-10 h-10 text-blue-500" />
        </div>
      </Link>

      <nav className="py-4">
        <div className="space-y-1">
          <SidebarItem 
            icon={Stethoscope} 
            label="Consultation"
            children={[
              "Nouvelle consultation",
              "Historique",
              "Rendez-vous"
            ]}
          />

          <SidebarItem 
            icon={Users} 
            label="Patients"
            children={[
              "Liste des patients",
              "Jumeau numérique",
              "Suivi patients"
            ]}
          />

          <SidebarItem 
            icon={FileText} 
            label="Ordonnances"
            children={[
              "Nouvelle ordonnance",
              "Historique",
              "Pharmacies"
            ]}
          />

          <SidebarItem 
            icon={Activity} 
            label="Monitoring"
            children={[
              "Signes vitaux",
              "Téléconsultation",
              "Alertes"
            ]}
          />

          <SidebarItem 
            icon={Globe} 
            label="Localisation"
            children={[
              "Langue",
              "Mode hors-ligne",
              "Spécificités régionales"
            ]}
          />

          <SidebarItem 
            icon={Shield} 
            label="Sécurité"
            children={[
              "Chiffrement",
              "Audit",
              "Sauvegardes"
            ]}
          />

          <SidebarItem 
            icon={Settings} 
            label="Paramètres"
            children={[
              "Thème",
              "Accessibilité",
              "Personnalisation"
            ]}
          />
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;