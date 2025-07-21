import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserMenu } from "@/components/UserMenu";
import { ResourceMonitorChart } from "@/components/charts/ResourceMonitorChart";
import { ResourceMonitorWidget } from "@/components/charts/ResourceMonitorWidget";
import { BillingChart } from "@/components/charts/BillingChart";
import { APIUsageChart } from "@/components/charts/APIUsageChart";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { Canvas } from "@/components/workspace/Canvas";
import { ModelDeployment } from "@/components/workspace/ModelDeployment";
import { AIAgent } from "@/components/workspace/AIAgent";
import { ComponentMarketplace } from "@/components/marketplace/ComponentMarketplace";
import { ComponentWorkspace } from "@/components/marketplace/ComponentWorkspace";
import { WorkspaceTemplate } from "@/components/workspace/WorkspaceTemplate";
import { WorkspaceToolbar } from "@/components/workspace/WorkspaceToolbar";
import { WorkspaceModeProvider } from "@/components/workspace/WorkspaceModeProvider";
import { FloatingNavigation } from "@/components/workspace/FloatingNavigation";
import { FixedSidebar } from "@/components/workspace/FixedSidebar";
import { WorkspaceManagement } from "@/components/workspace/WorkspaceManagement";
import { HomePage } from "@/components/workspace/HomePage";
import { FloatingAIChat } from "@/components/workspace/FloatingAIChat";
import { AIWorkspaceNavigator } from "@/components/workspace/AIWorkspaceNavigator";
import { JobQueue } from "@/components/workspace/JobQueue";
import { FileSync } from "@/components/workspace/FileSync";
import { Diagnostics } from "@/components/workspace/Diagnostics";
import { useWorkspace } from "@/hooks/useWorkspace";
import { toast } from "sonner";
import { mockDataService } from "@/services/mockDataService";
import { ChevronLeft, ChevronRight, BarChart3, Zap, ShoppingBag, Wrench, Users, FileText, User, Settings, CreditCard, Layout, Edit3, Check, X, Home, Bot, Sparkles, Send, ArrowLeftRight, Menu } from "lucide-react";
const Workspace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentWorkspace,
    updateWorkspace,
    createWorkspace
  } = useWorkspace();

  // Authentication check removed since database tables were deleted

  // 获取从项目创建页面传递的状态
  const creationState = location.state;
  const [selectedNav, setSelectedNav] = useState("workspace");
  const [chatMessages, setChatMessages] = useState([{
    id: 1,
    type: "assistant",
    content: "您好！我是Alaya AI助手，可以帮您管理工作空间、部署模型、执行AI任务。试试说'帮我部署一个模型'或'调整画布布局'？"
  }]);
  const [newMessage, setNewMessage] = useState("");
  const [workspaceComponents, setWorkspaceComponents] = useState<any[]>([]);

  // 图表数据状态
  const [resourceData, setResourceData] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [apiUsageData, setApiUsageData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  // AI Agent状态
  const [agentTasks, setAgentTasks] = useState([]);

  // 资源监控图表显示状态
  const [showResourceCharts, setShowResourceCharts] = useState(false);

  // 工作空间名称编辑状态
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState("");

  // 工作空间创建过程状态
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  const [creationStep, setCreationStep] = useState("");
  const [creationComplete, setCreationComplete] = useState(false);

  // 导航栏状态
  const [useFixedSidebar, setUseFixedSidebar] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // AI导航栏状态
  const [showAINavigator, setShowAINavigator] = useState(false);
  const [aiNavigatorCollapsed, setAINavigatorCollapsed] = useState(false);

  // 初始化当前工作空间名称
  useEffect(() => {
    if (currentWorkspace) {
      setEditingName(currentWorkspace.name);
    }
  }, [currentWorkspace]);

  // 处理工作空间创建流程
  useEffect(() => {
    if (creationState?.creationMode) {
      setIsCreating(true);
      setSelectedNav("workspace");
      setShowAINavigator(true);  // 显示AI导航栏

      // 模拟创建过程
      const steps = [{
        step: "正在分析AI建议...",
        progress: 20
      }, {
        step: "配置工作空间环境...",
        progress: 40
      }, {
        step: "部署组件中...",
        progress: 60
      }, {
        step: "建立连接关系...",
        progress: 80
      }, {
        step: "完成工作空间配置...",
        progress: 100
      }];
      let currentStepIndex = 0;
      const interval = setInterval(() => {
        if (currentStepIndex < steps.length) {
          setCreationStep(steps[currentStepIndex].step);
          setCreationProgress(steps[currentStepIndex].progress);
          currentStepIndex++;
        } else {
          clearInterval(interval);
          // 实际创建工作空间
          createWorkspace({
            name: creationState.workspaceConfig.name,
            description: creationState.workspaceConfig.description,
            type: creationState.workspaceConfig.type,
            components: creationState.suggestedComponents
          });
          setWorkspaceComponents(creationState.suggestedComponents || []);
          setCreationComplete(true);
          setTimeout(() => {
            setIsCreating(false);
            toast.success("工作空间创建完成！");
          }, 2000);
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [creationState, createWorkspace]);

  // 初始化和更新数据
  useEffect(() => {
    const updateData = () => {
      setResourceData(mockDataService.generateResourceData());
      setBillingData(mockDataService.generateBillingData());
      setApiUsageData(mockDataService.generateAPIUsageData());
      setPerformanceData(mockDataService.generatePerformanceData());
    };
    updateData();
    const interval = setInterval(updateData, 30000); // 每30秒更新一次

    return () => clearInterval(interval);
  }, []);

  // AI Agent执行指令
  const handleExecuteCommand = async (command: string): Promise<string> => {
    // 这里可以集成真实的AI模型API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`已执行指令: ${command}`);
      }, 1000);
    });
  };

  // AI Agent更新画布
  const handleUpdateCanvas = (action: string, params: any) => {
    console.log('Canvas update:', action, params);
    // 这里可以实现实际的画布更新逻辑
  };

  // 模型部署处理
  const handleModelDeploy = (config: any) => {
    console.log('Model deployment:', config);
    // 实际的模型部署逻辑
  };

  // 处理工作空间名称编辑
  const handleSaveWorkspaceName = async () => {
    if (!currentWorkspace || !editingName.trim()) return;
    try {
      await updateWorkspace(currentWorkspace.id, {
        name: editingName.trim()
      });
      setIsEditingName(false);
      toast.success("工作空间名称已更新");
    } catch (error) {
      toast.error("更新工作空间名称失败");
    }
  };
  const handleCancelEditName = () => {
    setEditingName(currentWorkspace?.name || "");
    setIsEditingName(false);
  };

  // 悬浮导航栏处理函数
  const handleNewWorkspace = () => {
    navigate("/projects");
  };
  const handleSwitchWorkspace = () => {
    toast.info("切换工作空间功能开发中...");
  };
  const handleSaveTemplate = () => {
    if (!currentWorkspace) {
      toast.error("没有可保存的工作空间");
      return;
    }
    toast.success("工作空间已保存为模板");
  };
  const handleDeleteTemplate = () => {
    toast.error("删除模板功能开发中...");
  };

  // 应用工作空间模板
  const handleApplyTemplate = (template: any) => {
    // 根据模板组件创建工作空间组件
    const templateComponents = template.components.map((componentName: string, index: number) => ({
      id: `${template.id}-${componentName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: componentName,
      icon: getComponentIcon(componentName),
      x: 100 + index % 3 * 180,
      y: 100 + Math.floor(index / 3) * 140,
      type: getComponentType(componentName),
      status: "idle"
    }));
    setWorkspaceComponents(prev => [...prev, ...templateComponents]);

    // 更新当前工作空间
    if (currentWorkspace) {
      updateWorkspace(currentWorkspace.id, {
        components: [...(currentWorkspace.components || []), ...templateComponents]
      });
    }
    setSelectedNav("workspace"); // 切换到工作空间页面
    toast.success(`${template.name}模板已成功应用到工作空间！`);
  };
  const getComponentIcon = (componentName: string) => {
    const iconMap: {
      [key: string]: string;
    } = {
      "Jupyter Notebook": "📓",
      "GPU Monitor": "⚡",
      "Model Trainer": "🤖",
      "Data Processor": "🔧",
      "VS Code": "💻",
      "Terminal": "⚡",
      "Database Client": "🗄️",
      "API Tester": "🔌",
      "Jupyter Lab": "📓",
      "Chart Builder": "📊",
      "Data Connector": "🔗",
      "Stats Panel": "📈",
      "Design Tool": "🎨",
      "Prototype Builder": "🔨",
      "Color Palette": "🎨",
      "Asset Manager": "📁",
      "Solidity IDE": "💻",
      "Blockchain Explorer": "⛓️",
      "Wallet Connector": "💳",
      "Test Network": "🌐",
      "Monitor Dashboard": "📊",
      "CI/CD Pipeline": "⚙️",
      "Log Viewer": "📋",
      "Deploy Tools": "🚀"
    };
    return iconMap[componentName] || "⚙️";
  };
  const getComponentType = (componentName: string) => {
    if (componentName.includes("Jupyter")) return "jupyter";
    if (componentName.includes("Terminal")) return "terminal";
    if (componentName.includes("Deploy") || componentName.includes("Model")) return "model-deploy";
    if (componentName.includes("Monitor")) return "tensorboard";
    if (componentName.includes("Code") || componentName.includes("IDE")) return "code-editor";
    return "custom";
  };
  const navGroups = [{
    title: "主菜单",
    items: [{
      id: "workspace",
      name: "工作空间",
      icon: Wrench,
      fullName: "工作空间"
    }, {
      id: "compute",
      name: "算力管理",
      icon: Zap,
      fullName: "算力管理"
    }]
  }, {
    title: "资源",
    items: [{
      id: "marketplace",
      name: "组件市场",
      icon: ShoppingBag,
      fullName: "组件市场"
    }, {
      id: "template",
      name: "工作空间模板",
      icon: Layout,
      fullName: "工作空间模板"
    }, {
      id: "community",
      name: "社区",
      icon: Users,
      fullName: "社区"
    }, {
      id: "docs",
      name: "文档",
      icon: FileText,
      fullName: "文档"
    }]
  }, {
    title: "设置",
    items: [{
      id: "personal",
      name: "个人设置",
      icon: User,
      fullName: "个人设置"
    }, {
      id: "platform",
      name: "平台设置",
      icon: Settings,
      fullName: "平台设置"
    }, {
      id: "billing",
      name: "计费中心",
      icon: CreditCard,
      fullName: "计费中心"
    }]
  }];
  const workspaceItems = [{
    id: "notebook",
    name: "Jupyter Notebook",
    icon: "📓",
    x: 100,
    y: 100
  }, {
    id: "vscode",
    name: "VS Code",
    icon: "💻",
    x: 250,
    y: 100
  }, {
    id: "terminal",
    name: "Terminal",
    icon: "⚡",
    x: 400,
    y: 100
  }, {
    id: "browser",
    name: "Browser",
    icon: "🌐",
    x: 100,
    y: 250
  }, {
    id: "docker",
    name: "Docker",
    icon: "🐳",
    x: 250,
    y: 250
  }, {
    id: "git",
    name: "Git Client",
    icon: "📋",
    x: 400,
    y: 250
  }];
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: newMessage
    };
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // 增强的AI回复逻辑
    setTimeout(() => {
      let response = "我已经收到您的消息，正在为您处理...";
      const message = newMessage.toLowerCase();
      if (message.includes("部署") && message.includes("模型")) {
        response = "我可以帮您部署模型！请告诉我模型类型和配置要求，我将为您自动配置GPU资源并启动部署流程。";
      } else if (message.includes("画布") || message.includes("布局")) {
        response = "我可以帮您调整工作空间布局！您可以说'添加Terminal组件'或'重新排列组件'，我会自动操作画布。";
      } else if (message.includes("监控") || message.includes("资源")) {
        response = "让我为您查看当前资源使用情况... 当前GPU使用率78%，建议优化算力分配以提升效率。";
      } else if (message.includes("费用") || message.includes("账单")) {
        response = "根据当前使用情况，本月预计费用¥1,234，比上月增长12%。我建议启用自动资源调度来优化成本。";
      }
      const aiResponse = {
        id: Date.now() + 1,
        type: "assistant",
        content: response
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // 根据工作空间类型获取可用的导航项
  const getAvailableNavItems = () => {
    const workspaceType = currentWorkspace?.type || 'default';
    switch (workspaceType) {
      case 'machine-learning':
        return navGroups.map(group => ({
          ...group,
          items: group.items.filter(item => ['compute', 'model', 'dataset', 'tasks', 'workspace', 'template'].includes(item.id))
        })).filter(group => group.items.length > 0);
      case 'web-development':
        return navGroups.map(group => ({
          ...group,
          items: group.items.filter(item => ['environment', 'workspace', 'marketplace', 'template', 'community', 'docs'].includes(item.id))
        })).filter(group => group.items.length > 0);
      case 'data-analysis':
        return navGroups.map(group => ({
          ...group,
          items: group.items.filter(item => ['compute', 'dataset', 'tasks', 'workspace', 'template', 'billing'].includes(item.id))
        })).filter(group => group.items.length > 0);
      default:
        return navGroups;
    }
  };

  // 根据工作空间类型渲染不同的工作空间布局
  const renderWorkspaceByType = () => {
    const workspaceType = currentWorkspace?.type || 'default';
    switch (workspaceType) {
      case 'machine-learning':
        return <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🧠 {currentWorkspace?.name || "机器学习工作空间"}
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 ml-2">ML</Badge>
              </h2>
              <p className="text-gray-400">专为机器学习和深度学习优化的工作环境</p>
            </div>
            
            {/* ML特定的概览卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🧠</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">训练任务</h3>
                    <p className="text-2xl font-bold text-blue-400">2</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">数据集</h3>
                    <p className="text-2xl font-bold text-green-400">5</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">部署模型</h3>
                    <p className="text-2xl font-bold text-purple-400">3</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">GPU使用率</h3>
                    <p className="text-2xl font-bold text-orange-400">78%</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* ML专用组件 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResourceMonitorChart data={resourceData} />
              <PerformanceChart data={performanceData} />
            </div>
          </div>;
      case 'web-development':
        return <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                💻 {currentWorkspace?.name || "Web开发工作空间"}
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 ml-2">WEB</Badge>
              </h2>
              <p className="text-gray-400">专为前端和全栈开发优化的工作环境</p>
            </div>
            
            {/* Web开发特定的概览卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🌐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">活跃项目</h3>
                    <p className="text-2xl font-bold text-green-400">4</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🔧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">开发工具</h3>
                    <p className="text-2xl font-bold text-blue-400">8</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📦</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">组件库</h3>
                    <p className="text-2xl font-bold text-purple-400">12</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">部署状态</h3>
                    <p className="text-2xl font-bold text-orange-400">良好</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Web开发专用组件工作空间 */}
            <ComponentWorkspace initialComponents={workspaceComponents} />
          </div>;
      case 'data-analysis':
        return <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                📊 {currentWorkspace?.name || "数据分析工作空间"}
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 ml-2">DATA</Badge>
              </h2>
              <p className="text-gray-400">专为数据科学和分析优化的工作环境</p>
            </div>
            
            {/* 数据分析特定的概览卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-cyan-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📈</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">分析任务</h3>
                    <p className="text-2xl font-bold text-cyan-400">6</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">💾</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">数据源</h3>
                    <p className="text-2xl font-bold text-green-400">9</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">报告</h3>
                    <p className="text-2xl font-bold text-purple-400">15</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">处理能力</h3>
                    <p className="text-2xl font-bold text-orange-400">92%</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* 数据分析专用图表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <APIUsageChart data={apiUsageData} />
              <BillingChart data={billingData} />
            </div>
          </div>;
      default:
        return <div className="space-y-6 mx-[147px]">
            <div className="mb-6">
              
              
            </div>
            
            {/* 概览卡片 */}
            <div className="grid grid-cols-6 gap-4 mb-8">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-lg flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300">
                <span className="text-2xl mb-1">💼</span>
                <span className="text-xs text-white">项目</span>
                <span className="text-sm font-bold text-blue-400">3</span>
              </div>
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-lg flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300">
                <span className="text-2xl mb-1">⚡</span>
                <span className="text-xs text-white">算力</span>
                <span className="text-sm font-bold text-green-400">78%</span>
              </div>
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-lg flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300">
                <span className="text-2xl mb-1">💰</span>
                <span className="text-xs text-white">费用</span>
                <span className="text-sm font-bold text-purple-400">¥126</span>
              </div>
            </div>

            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <ResourceMonitorWidget data={resourceData} onClick={() => setShowResourceCharts(!showResourceCharts)} isActive={showResourceCharts} />
              {showResourceCharts && <>
                  <ResourceMonitorChart data={resourceData} />
                  <APIUsageChart data={apiUsageData} />
                </>}
            </div>

            {/* 组件工作空间区域 */}
            <div className="space-y-6">
              <ComponentWorkspace initialComponents={workspaceComponents} />
            </div>
          </div>;
    }
  };

  // 渲染不同导航项的内容看板
  const renderContent = () => {
    switch (selectedNav) {
      case "home":
        return <HomePage onNavigate={setSelectedNav} />;
      case "workspace":
        return <WorkspaceManagement currentWorkspace={currentWorkspace} onNavigate={setSelectedNav} />;
      case "filesync":
        return <FileSync />;
      case "jobqueue":
        return <JobQueue />;
      case "diagnostics":
        return <Diagnostics />;
      case "monitor":
        return <div className="space-y-6 p-6 bg-white rounded-lg">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-violet-800 mb-2">资源监控</h2>
              <p className="text-gray-600 text-lg">实时监控系统资源使用情况</p>
            </div>
            <h3 className="text-lg font-semibold mb-4 text-violet-700">GPU 实例</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-violet-50 rounded-lg border border-violet-100">
                <div>
                  <p className="font-medium text-violet-800">NVIDIA A100</p>
                  <p className="text-sm text-gray-600">80GB 显存</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">运行中</Badge>
              </div>
              <div className="flex justify-between items-center p-4 bg-violet-50 rounded-lg border border-violet-100">
                <div>
                  <p className="font-medium text-violet-800">NVIDIA V100</p>
                  <p className="text-sm text-gray-600">32GB 显存</p>
                </div>
                <Badge className="bg-gray-100 text-gray-500 border-gray-200">已停止</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResourceMonitorChart data={resourceData} />
              <PerformanceChart data={performanceData} />
            </div>
          </div>;
      case "billing":
        return <div className="space-y-6 p-6 bg-white rounded-lg">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-violet-800 mb-2">订单管理</h2>
              <p className="text-gray-600 text-lg">查看您的订单和计费信息</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BillingChart data={billingData} />
              <APIUsageChart data={apiUsageData} />
            </div>
          </div>;
      case "file-sync":
        return <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-white">文件</h2>
              <p className="text-gray-400">管理工作空间文件和同步状态</p>
            </div>
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">同步状态</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white">本地文件</span>
                  </div>
                  <span className="text-green-400 text-sm">已同步</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-white">远程仓库</span>
                  </div>
                  <span className="text-yellow-400 text-sm">同步中</span>
                </div>
              </div>
            </Card>
          </div>;
      case "task-queue":
        return <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-white">任务队列</h2>
              <p className="text-gray-400">管理和监控后台任务</p>
            </div>
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">运行中的任务</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">模型训练任务</h4>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      运行中
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">ResNet50 在 CIFAR-10 数据集上的训练</p>
                  <div className="w-full bg-border/50 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{
                    width: '65%'
                  }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Epoch 65/100</p>
                </div>
              </div>
            </Card>
          </div>;
      case "diagnostics":
        return <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-white">系统诊断</h2>
              <p className="text-gray-400">检查系统健康状态和性能</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">系统状态</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">CPU使用率</span>
                    <span className="text-green-400">23%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">内存使用率</span>
                    <span className="text-yellow-400">67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">GPU使用率</span>
                    <span className="text-red-400">89%</span>
                  </div>
                </div>
              </Card>
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">连接测试</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">API服务</span>
                    <span className="text-green-400">正常</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">数据库</span>
                    <span className="text-green-400">正常</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">存储服务</span>
                    <span className="text-green-400">正常</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>;
      case "marketplace":
        return <ComponentMarketplace />;
      case "workspace":
        return renderWorkspaceByType();
      case "template":
        return <WorkspaceTemplate onApplyTemplate={handleApplyTemplate} />;
      case "community":
        return <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-white">社区</h2>
              <p className="text-gray-400">与开发者交流和分享经验</p>
            </div>
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">热门讨论</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">如何优化GPU使用率？</h4>
                      <p className="text-sm text-gray-400 mt-1">在深度学习训练中，如何最大化GPU利用率...</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>👍 23</span>
                        <span>💬 12</span>
                        <span>2小时前</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">分享：自动化部署脚本</h4>
                      <p className="text-sm text-gray-400 mt-1">分享一个可以自动部署模型到生产环境的脚本...</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>👍 45</span>
                        <span>💬 8</span>
                        <span>5小时前</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>;
      case "docs":
        return <div className="space-y-6 p-6 bg-white rounded-lg">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-violet-800 mb-2">文档说明</h2>
              <p className="text-gray-600 text-lg">查阅平台使用文档和开发者指南</p>
            </div>
            <Card className="bg-violet-50 border border-violet-100 p-6 mb-4">
              <h3 className="text-xl font-semibold text-violet-700 mb-2">快速入门</h3>
              <p className="text-gray-700 mb-2">欢迎使用算力云桌面！您可以在这里查阅平台的基础操作、常见问题和开发者API文档。</p>
              <Button className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 mt-2">查看文档</Button>
            </Card>
            <Card className="bg-violet-50 border border-violet-100 p-6">
              <h3 className="text-xl font-semibold text-violet-700 mb-2">开发者文档</h3>
              <p className="text-gray-700 mb-2">集成API、SDK、Webhook等高级功能，助力自动化与二次开发。</p>
              <Button className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 mt-2">API参考</Button>
            </Card>
          </div>;
      case "personal":
        return <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-white">个人设置</h2>
              <p className="text-gray-400">管理个人账户和偏好设置</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">账户信息</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">用户名</label>
                    <Input className="mt-1 bg-white/5 border-white/10 text-white" defaultValue="developer@example.com" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">显示名称</label>
                    <Input className="mt-1 bg-white/5 border-white/10 text-white" defaultValue="开发者" />
                  </div>
                  <Button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30">
                    更新信息
                  </Button>
                </div>
              </Card>
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">偏好设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">深色模式</span>
                    <div className="w-10 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">邮件通知</span>
                    <div className="w-10 h-6 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">自动保存</span>
                    <div className="w-10 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>;
      case "platform":
        return <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-white">平台设置</h2>
              <p className="text-gray-400">配置平台级别的选项和权限</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">资源配置</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">默认GPU类型</label>
                    <select className="w-full mt-1 p-2 bg-white/5 border border-white/10 rounded-lg text-white">
                      <option value="a100">NVIDIA A100</option>
                      <option value="v100">NVIDIA V100</option>
                      <option value="t4">NVIDIA T4</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">内存限制 (GB)</label>
                    <Input className="mt-1 bg-white/5 border-white/10 text-white" defaultValue="32" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">存储限制 (GB)</label>
                    <Input className="mt-1 bg-white/5 border-white/10 text-white" defaultValue="500" />
                  </div>
                </div>
              </Card>
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">安全设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">双重认证</span>
                    <div className="w-10 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">IP白名单</span>
                    <div className="w-10 h-6 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">API访问控制</span>
                    <div className="w-10 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>;
      case "billing":
        return <div className="space-y-6 p-6 bg-white rounded-lg">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-violet-800 mb-2">计费中心</h2>
              <p className="text-gray-600 text-lg">管理账单、费用和支付方式</p>
            </div>
            
            {/* 费用概览 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-2">本月费用</h3>
                  <p className="text-3xl font-bold text-blue-400">¥1,234</p>
                  <p className="text-sm text-gray-400 mt-1">比上月增长 12%</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-2">账户余额</h3>
                  <p className="text-3xl font-bold text-green-400">¥856</p>
                  <p className="text-sm text-gray-400 mt-1">可用 2.5 个月</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-2">预计下月</h3>
                  <p className="text-3xl font-bold text-purple-400">¥1,089</p>
                  <p className="text-sm text-gray-400 mt-1">基于当前使用</p>
                </div>
              </div>
            </div>

            {/* 费用趋势图表 */}
            <BillingChart data={billingData} />

            {/* 账单列表 */}
            <Card className="glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">最近账单</h3>
                <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  查看全部
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium text-white">2024年1月账单</p>
                    <p className="text-sm text-gray-400">GPU使用费 + 存储费</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">¥1,156</p>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">已支付</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium text-white">2023年12月账单</p>
                    <p className="text-sm text-gray-400">GPU使用费 + 存储费</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">¥1,089</p>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">已支付</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>;
      default:
        return <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">自定义工作空间</h2>
              <p className="text-muted-foreground">拖拽组件创建您的专属工作环境</p>
            </div>
            <div className="relative h-[600px] bg-card/20 rounded-lg border-2 border-dashed border-border/50 overflow-hidden">
              {workspaceItems.map(item => <div key={item.id} className="absolute w-20 h-20 bg-card/80 backdrop-blur-lg rounded-lg border border-border/50 flex flex-col items-center justify-center cursor-move hover:scale-105 transition-transform group" style={{
              left: item.x,
              top: item.y
            }}>
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-xs text-center leading-tight">{item.name}</span>
                </div>)}
              <div className="absolute bottom-4 right-4">
                <Button variant="outline" className="bg-card/80 backdrop-blur-lg">
                  ➕ 添加组件
                </Button>
              </div>
            </div>
          </div>;
    }
  };
  return <WorkspaceModeProvider>
      <div className="min-h-screen bg-white relative flex">
        {/* 导航栏 - 根据模式选择 */}
        {useFixedSidebar ? <FixedSidebar selectedNav={selectedNav} onNavSelect={setSelectedNav} isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} /> : <FloatingNavigation selectedNav={selectedNav} onNavSelect={setSelectedNav} onNewWorkspace={handleNewWorkspace} onSwitchWorkspace={handleSwitchWorkspace} onSaveTemplate={handleSaveTemplate} onDeleteTemplate={handleDeleteTemplate} />}
      
        {/* 主内容区域 - 向右移动并居中分布 */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${useFixedSidebar ? sidebarCollapsed ? 'ml-16' : 'ml-64' : 'ml-20'} ${showAINavigator ? aiNavigatorCollapsed ? 'mr-16' : 'mr-96' : 'mr-0'}`}>
            {/* 顶部导航栏 */}
            <div className="flex-1 p-6 overflow-auto bg-violet-50">
            <div className="h-full flex gap-6 mx-0 my-0 px-0 py-0">
              <div className="flex-1">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>

        {/* AI工作空间导航栏 */}
        <AIWorkspaceNavigator
          isVisible={showAINavigator}
          isCollapsed={aiNavigatorCollapsed}
          onToggleCollapse={() => setAINavigatorCollapsed(!aiNavigatorCollapsed)}
          creationHistory={creationState?.chatHistory || []}
          onClose={() => setShowAINavigator(false)}
        />

        {/* 悬浮AI对话框 */}
        {!showAINavigator && <FloatingAIChat />}
      </div>
    </WorkspaceModeProvider>;
};
export default Workspace;