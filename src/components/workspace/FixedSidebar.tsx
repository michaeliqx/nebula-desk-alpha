import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FolderOpen, 
  Activity, 
  ShoppingCart, 
  Package, 
  FileText, 
  RefreshCw, 
  ListTodo, 
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FixedSidebarProps {
  selectedNav: string;
  onNavSelect: (nav: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const FixedSidebar = ({ 
  selectedNav, 
  onNavSelect,
  isCollapsed,
  onToggleCollapse
}: FixedSidebarProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/workspace");
  };

  const navigationItems = [
    { id: "workspace", name: "工作空间管理", icon: FolderOpen },
    { id: "monitor", name: "资源监控", icon: Activity },
    { id: "billing", name: "订单", icon: ShoppingCart },
    { id: "docs", name: "文档说明", icon: FileText },
    { id: "marketplace", name: "组件市场", icon: Package },
    { id: "filesync", name: "文件", icon: RefreshCw },
    { id: "jobqueue", name: "任务队列", icon: ListTodo },
    { id: "diagnostics", name: "诊断", icon: Stethoscope }
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 z-30 h-screen w-64 border-r border-violet-100 bg-white transition-all duration-300",
      isCollapsed && "w-16"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-violet-100">
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-violet-800">算力云桌面</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-violet-600 hover:bg-violet-50"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedNav === item.id;

            return (
              <div key={item.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 text-left font-medium transition-colors",
                    isSelected
                      ? "bg-violet-50 text-violet-800"
                      : "text-gray-600 hover:bg-violet-50/50 hover:text-violet-700",
                    isCollapsed && "justify-center"
                  )}
                  onClick={() => onNavSelect(item.id)}
                >
                  <Icon className={cn(
                    "h-5 w-5",
                    isSelected ? "text-violet-600" : "text-gray-500"
                  )} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Button>
                {isSelected && !isCollapsed && (
                  <div className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-violet-600" />
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-violet-100 p-4">
        </div>
      </div>
    </div>
  );
};