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
  Trash2,
  Plus,
  ArrowLeftRight,
  Save,
  Home,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FloatingNavigationProps {
  selectedNav: string;
  onNavSelect: (nav: string) => void;
  onNewWorkspace?: () => void;
  onSwitchWorkspace?: () => void;
  onSaveTemplate?: () => void;
  onDeleteTemplate?: () => void;
}

export const FloatingNavigation = ({ 
  selectedNav, 
  onNavSelect,
  onNewWorkspace,
  onSwitchWorkspace,
  onSaveTemplate,
  onDeleteTemplate
}: FloatingNavigationProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true); // 默认保持折叠状态
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const navigationItems = [
    {
      id: "home",
      name: "主页",
      icon: Home,
      action: handleHomeClick,
    },
    {
      id: "workspace-management",
      name: "工作空间管理",
      icon: FolderOpen,
      hasDropdown: true,
      items: [
        { id: "new-workspace", name: "新建工作空间", icon: Plus, action: onNewWorkspace },
        { id: "switch-workspace", name: "切换工作空间", icon: ArrowLeftRight, action: onSwitchWorkspace },
        { id: "save-template", name: "保存为模板", icon: Save, action: onSaveTemplate }
      ]
    },
    {
      id: "monitoring",
      name: "资源监控",
      icon: Activity,
    },
    {
      id: "orders",
      name: "订单",
      icon: ShoppingCart,
    },
    {
      id: "marketplace",
      name: "组件市场",
      icon: Package,
    },
    {
      id: "docs",
      name: "文档说明",
      icon: FileText,
    },
    {
      id: "file-sync",
      name: "文件",
      icon: RefreshCw,
    },
    {
      id: "task-queue",
      name: "任务队列",
      icon: ListTodo,
    },
    {
      id: "diagnostics",
      name: "诊断",
      icon: Stethoscope,
    },
    {
      id: "delete-template",
      name: "删除工作空间模板",
      icon: Trash2,
      action: onDeleteTemplate,
      variant: "destructive" as const
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.action) {
      item.action();
    } else {
      onNavSelect(item.id);
    }
  };

  return (
    <TooltipProvider>
      <div className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ${
        isCollapsed ? 'translate-x-0' : 'translate-x-0'
      }`}>
        {/* 折叠/展开按钮 */}
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 rounded-full bg-purple-500/20 backdrop-blur-xl border border-purple-300/30 text-purple-300 hover:bg-purple-500/30 hover:scale-110 transition-all duration-300"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </Button>
        </div>

        <div className={cn(
          "fixed left-4 top-4 z-30 flex flex-col gap-2 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}>
          <Card className="bg-white border border-violet-100 shadow-lg p-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedNav === item.id;

              if (item.hasDropdown) {
                return (
                  <DropdownMenu key={item.id}>
                    <DropdownMenuTrigger asChild>
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
                      >
                        <Icon className={cn(
                          "h-5 w-5",
                          isSelected ? "text-violet-600" : "text-gray-500"
                        )} />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {item.items?.map((subItem) => (
                        <DropdownMenuItem
                          key={subItem.id}
                          onClick={subItem.action}
                          className="gap-2 text-gray-600 hover:text-violet-700"
                        >
                          <subItem.icon className="h-4 w-4" />
                          <span>{subItem.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 text-left font-medium transition-colors",
                    isSelected
                      ? "bg-violet-50 text-violet-800"
                      : "text-gray-600 hover:bg-violet-50/50 hover:text-violet-700",
                    isCollapsed && "justify-center",
                    item.variant === "destructive" && "text-red-600 hover:text-red-700 hover:bg-red-50"
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  <Icon className={cn(
                    "h-5 w-5",
                    isSelected ? "text-violet-600" : item.variant === "destructive" ? "text-red-500" : "text-gray-500"
                  )} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Button>
              );
            })}
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};