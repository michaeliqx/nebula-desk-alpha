import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DraggableComponent } from "../workspace/DraggableComponent";
import { ConnectionLine } from "../workspace/ComponentConnection";
import { AIAgent } from "../workspace/AIAgent";
import { ResourceMonitorWidget } from "../charts/ResourceMonitorWidget";
import { ResourceMonitorChart } from "../charts/ResourceMonitorChart";
import { toast } from "sonner";
import { Terminal, FileText, Rocket, Settings, Monitor } from "lucide-react";
interface WorkspaceComponent {
  id: string;
  name: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  type: "terminal" | "jupyter" | "model-deploy" | "tensorboard" | "code-editor" | "resource-monitor" | "custom";
  status: "idle" | "running" | "error";
  size: "1x1" | "1x4"; // 组件尺寸
  connections?: Array<{
    targetId: string;
    type: "data" | "control" | "error";
  }>;
}
interface ComponentFlow {
  id: string;
  name: string;
  components: WorkspaceComponent[];
  connections: Array<{
    sourceId: string;
    targetId: string;
    type: "data" | "control" | "error";
  }>;
}
const componentTemplates = {
  terminal: {
    name: "Terminal",
    icon: <Terminal className="w-8 h-8" />,
    type: "terminal" as const,
    size: "1x1" as const
  },
  jupyter: {
    name: "Jupyter",
    icon: <FileText className="w-8 h-8" />,
    type: "jupyter" as const,
    size: "1x1" as const
  },
  "model-deploy": {
    name: "模型部署",
    icon: <Rocket className="w-8 h-8" />,
    type: "model-deploy" as const,
    size: "1x1" as const
  },
  tensorboard: {
    name: "TensorBoard",
    icon: <Settings className="w-8 h-8" />,
    type: "tensorboard" as const,
    size: "1x1" as const
  },
  "code-editor": {
    name: "代码编辑器",
    icon: <FileText className="w-8 h-8" />,
    type: "code-editor" as const,
    size: "1x1" as const
  },
  "resource-monitor": {
    name: "资源监控",
    icon: <Monitor className="w-8 h-8" />,
    type: "resource-monitor" as const,
    size: "1x1" as const
  }
};
const predefinedFlows: ComponentFlow[] = [{
  id: "ml-pipeline",
  name: "机器学习流水线",
  components: [{
    id: "data-prep",
    name: "数据预处理",
    icon: <Settings className="w-6 h-6" />,
    x: 100,
    y: 100,
    type: "jupyter",
    status: "idle",
    size: "1x1"
  }, {
    id: "training",
    name: "模型训练",
    icon: <FileText className="w-6 h-6" />,
    x: 300,
    y: 100,
    type: "jupyter",
    status: "idle",
    size: "1x1"
  }, {
    id: "deploy",
    name: "模型部署",
    icon: <Rocket className="w-6 h-6" />,
    x: 500,
    y: 100,
    type: "model-deploy",
    status: "idle",
    size: "1x1"
  }],
  connections: [{
    sourceId: "data-prep",
    targetId: "training",
    type: "data"
  }, {
    sourceId: "training",
    targetId: "deploy",
    type: "control"
  }]
}, {
  id: "dev-workflow",
  name: "开发工作流",
  components: [{
    id: "editor",
    name: "代码编辑",
    icon: <FileText className="w-6 h-6" />,
    x: 100,
    y: 100,
    type: "code-editor",
    status: "idle",
    size: "1x1"
  }, {
    id: "terminal",
    name: "终端",
    icon: <Terminal className="w-6 h-6" />,
    x: 300,
    y: 100,
    type: "terminal",
    status: "idle",
    size: "1x1"
  }, {
    id: "jupyter",
    name: "测试",
    icon: <FileText className="w-6 h-6" />,
    x: 500,
    y: 100,
    type: "jupyter",
    status: "idle",
    size: "1x1"
  }],
  connections: [{
    sourceId: "editor",
    targetId: "terminal",
    type: "control"
  }, {
    sourceId: "terminal",
    targetId: "jupyter",
    type: "data"
  }]
}];
interface ComponentWorkspaceProps {
  initialComponents?: WorkspaceComponent[];
}
export const ComponentWorkspace = ({
  initialComponents = []
}: ComponentWorkspaceProps) => {
  const [components, setComponents] = useState<WorkspaceComponent[]>(initialComponents);
  const [isEditMode, setIsEditMode] = useState(false);

  // 模拟资源数据
  const [resourceData] = useState([{
    time: "14:00",
    cpu: 45,
    memory: 62,
    gpu: 30
  }, {
    time: "14:05",
    cpu: 52,
    memory: 58,
    gpu: 35
  }, {
    time: "14:10",
    cpu: 48,
    memory: 65,
    gpu: 42
  }, {
    time: "14:15",
    cpu: 55,
    memory: 60,
    gpu: 38
  }, {
    time: "14:20",
    cpu: 50,
    memory: 63,
    gpu: 45
  }]);

  // 同步外部传入的组件
  useEffect(() => {
    if (initialComponents.length > 0) {
      setComponents(initialComponents);
    }
  }, [initialComponents]);
  const [connections, setConnections] = useState<Array<{
    sourceId: string;
    targetId: string;
    type: "data" | "control" | "error";
  }>>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSource, setConnectionSource] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const handlePositionChange = (id: string, x: number, y: number) => {
    setComponents(prev => prev.map(comp => comp.id === id ? {
      ...comp,
      x,
      y
    } : comp));
  };
  const handleSelect = (id: string) => {
    if (isConnecting && connectionSource && connectionSource !== id) {
      // 创建连接
      const newConnection = {
        sourceId: connectionSource,
        targetId: id,
        type: "data" as const
      };
      setConnections(prev => [...prev, newConnection]);
      setIsConnecting(false);
      setConnectionSource(null);
      toast.success("组件连接成功");
    } else {
      setSelectedComponent(id);
    }
  };
  const addComponentToWorkspace = (templateKey: string) => {
    const template = componentTemplates[templateKey as keyof typeof componentTemplates];
    if (!template) return;
    const newComponent: WorkspaceComponent = {
      id: `${templateKey}-${Date.now()}`,
      name: template.name,
      icon: template.icon,
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 100,
      type: template.type,
      status: "idle",
      size: template.size
    };
    setComponents(prev => [...prev, newComponent]);
    toast.success(`${template.name} 组件已添加到工作空间`);
  };
  const toggleComponentSize = (componentId: string) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === componentId && comp.type === "resource-monitor") {
        const newSize = comp.size === "1x1" ? "1x4" : "1x1";
        return {
          ...comp,
          size: newSize
        };
      }
      return comp;
    }));
  };
  const getComponentSize = (size: "1x1" | "1x4") => {
    switch (size) {
      case "1x4":
        return "w-64 h-32";
      // 1x4 size for expanded resource monitor
      default:
        return "w-20 h-20";
      // 1x1 size (smaller, more icon-like)
    }
  };
  const startConnection = () => {
    if (!selectedComponent) {
      toast.error("请先选择一个组件");
      return;
    }
    setIsConnecting(true);
    setConnectionSource(selectedComponent);
    toast.info("请点击目标组件完成连接");
  };
  const deleteSelectedComponent = () => {
    if (selectedComponent) {
      setComponents(prev => prev.filter(comp => comp.id !== selectedComponent));
      setConnections(prev => prev.filter(conn => conn.sourceId !== selectedComponent && conn.targetId !== selectedComponent));
      setSelectedComponent(null);
      toast.success("组件已删除");
    }
  };
  const runComponent = (componentId: string) => {
    setComponents(prev => prev.map(comp => comp.id === componentId ? {
      ...comp,
      status: "running"
    } : comp));

    // 模拟运行
    setTimeout(() => {
      setComponents(prev => prev.map(comp => comp.id === componentId ? {
        ...comp,
        status: "idle"
      } : comp));
      toast.success("组件执行完成");
    }, 3000);
  };
  const executeFlow = () => {
    if (components.length === 0) {
      toast.error("工作空间中没有组件");
      return;
    }
    toast.info("开始执行流程...");

    // 按连接顺序执行组件
    const sortedComponents = [...components];
    sortedComponents.forEach((comp, index) => {
      setTimeout(() => {
        runComponent(comp.id);
      }, index * 1000);
    });
  };
  const loadPredefinedFlow = (flow: ComponentFlow) => {
    setComponents(flow.components);
    setConnections(flow.connections);
    setSelectedComponent(null);
    toast.success(`已加载"${flow.name}"流程`);
  };
  const handleAIExecuteCommand = async (command: string): Promise<string> => {
    const cmd = command.toLowerCase();
    if (cmd.includes("添加") && cmd.includes("组件")) {
      if (cmd.includes("terminal")) {
        addComponentToWorkspace("terminal");
        return "Terminal组件已添加到工作空间";
      } else if (cmd.includes("jupyter")) {
        addComponentToWorkspace("jupyter");
        return "Jupyter组件已添加到工作空间";
      } else if (cmd.includes("部署")) {
        addComponentToWorkspace("model-deploy");
        return "模型部署组件已添加到工作空间";
      }
    }
    if (cmd.includes("执行") || cmd.includes("运行")) {
      executeFlow();
      return "已开始执行工作流程";
    }
    return "指令已接收，正在处理...";
  };
  const handleAIUpdateCanvas = (action: string, params: any) => {
    if (action === "add" && params.componentType) {
      addComponentToWorkspace(params.componentType);
    } else if (action === "execute") {
      executeFlow();
    }
  };
  const getStatusColor = (status: WorkspaceComponent["status"]) => {
    switch (status) {
      case "running":
        return "bg-violet-200 text-violet-600 border-violet-300";
      case "error":
        return "bg-red-100 text-red-400 border-red-200";
      default:
        return "bg-gray-100 text-gray-400 border-gray-200";
    }
  };
  return <div className="h-full bg-white backdrop-blur supports-[backdrop-filter]:bg-white/90">
      {/* Component Palette */}
      <div className="absolute top-4 left-4 z-10">
        
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10">
        
      </div>

      {/* Canvas */}
      <div ref={canvasRef} className="relative w-full h-full overflow-hidden" style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, #ede9fe 1px, transparent 0)`,
      backgroundSize: "20px 20px"
    }}>
        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((connection, index) => {
          const sourceComponent = components.find(c => c.id === connection.sourceId);
          const targetComponent = components.find(c => c.id === connection.targetId);
          if (!sourceComponent || !targetComponent) return null;
          return <ConnectionLine key={index} startX={sourceComponent.x + 100} startY={sourceComponent.y + 40} endX={targetComponent.x} endY={targetComponent.y + 40} type={connection.type} />;
        })}
        </svg>

        {/* Components */}
        {components.map(component => <div key={component.id} className="absolute" style={{
        left: component.x,
        top: component.y
      }}>
            {component.type === "resource-monitor" && component.size === "1x4" && isEditMode ? <div className="w-64 h-32">
                <ResourceMonitorChart data={resourceData} />
              </div> : <Card className={`${getComponentSize(component.size)} bg-violet-50/80 backdrop-blur-xl border border-violet-200 hover:border-violet-400 transition-all duration-300 flex flex-col items-center justify-center p-2 cursor-pointer ${selectedComponent === component.id ? 'border-violet-500 ring-2 ring-violet-400' : ''}`} onClick={() => {
          handleSelect(component.id);
          if (component.type === "resource-monitor" && isEditMode) {
            toggleComponentSize(component.id);
          }
        }}>
                <div className="mb-1">{component.icon}</div>
                <h3 className="text-violet-700 text-xs font-medium text-center leading-tight mb-1">
                  {component.name}
                </h3>
                <Badge className={`text-[10px] ${getStatusColor(component.status)}`}>
                  {component.status}
                </Badge>
              </Card>}
          </div>)}
      </div>

      {/* AI Agent - now floating */}
      <AIAgent onExecuteCommand={handleAIExecuteCommand} onUpdateCanvas={handleAIUpdateCanvas} />
    </div>;
};