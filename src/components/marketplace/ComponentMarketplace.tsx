import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Terminal, FileText, Settings, Rocket, Folder, Edit3 } from "lucide-react";

interface Component {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  type: "official" | "community" | "custom";
  features: string[];
  downloads: number;
  rating: number;
  tags: string[];
  isInstalled: boolean;
  position?: { x: number; y: number };
  isDragging?: boolean;
  groupId?: string;
}

interface ComponentGroup {
  id: string;
  name: string;
  components: Component[];
  position: { x: number; y: number };
  isExpanded: boolean;
}

const officialComponents: Component[] = [
  {
    id: "terminal",
    name: "Terminal",
    description: "全功能终端，支持命令行操作和脚本执行",
    icon: <Terminal className="w-6 h-6" />,
    category: "开发工具",
    type: "official",
    features: ["命令行界面", "脚本执行", "多窗口支持", "历史记录"],
    downloads: 15420,
    rating: 4.8,
    tags: ["终端", "命令行", "开发"],
    isInstalled: false
  },
  {
    id: "jupyter",
    name: "Jupyter Notebook",
    description: "交互式开发环境，支持文件上传和代码运行",
    icon: <FileText className="w-6 h-6" />,
    category: "开发工具",
    type: "official",
    features: ["文件上传", "代码执行", "可视化", "Markdown支持"],
    downloads: 12340,
    rating: 4.9,
    tags: ["notebook", "python", "数据科学"],
    isInstalled: true
  },
  {
    id: "model-deploy",
    name: "模型部署工具",
    description: "简化版模型部署工具，支持基础模型部署",
    icon: <Rocket className="w-6 h-6" />,
    category: "AI工具",
    type: "official",
    features: ["一键部署", "GPU配置", "API生成", "监控面板"],
    downloads: 8920,
    rating: 4.7,
    tags: ["模型", "部署", "AI"],
    isInstalled: false
  }
];

const communityComponents: Component[] = [
  {
    id: "tensorboard",
    name: "TensorBoard",
    description: "训练可视化工具",
    icon: <Settings className="w-6 h-6" />,
    category: "AI工具",
    type: "community",
    features: ["训练监控", "指标可视化", "模型图表"],
    downloads: 5670,
    rating: 4.5,
    tags: ["可视化", "训练", "监控"],
    isInstalled: false
  },
  {
    id: "code-editor",
    name: "代码编辑器",
    description: "在线代码编辑器，支持多语言",
    icon: <FileText className="w-6 h-6" />,
    category: "开发工具",
    type: "community",
    features: ["语法高亮", "代码补全", "多语言支持"],
    downloads: 7830,
    rating: 4.6,
    tags: ["编辑器", "代码", "开发"],
    isInstalled: false
  }
];

export const ComponentMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAIGenerateDialogOpen, setIsAIGenerateDialogOpen] = useState(false);
  const [newComponent, setNewComponent] = useState({
    name: "",
    description: "",
    category: "",
    features: "",
    uploadedFile: null as File | null
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [components, setComponents] = useState<Component[]>([
    ...officialComponents,
    ...communityComponents
  ]);
  const [componentGroups, setComponentGroups] = useState<ComponentGroup[]>([]);
  const [draggedComponent, setDraggedComponent] = useState<Component | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<{ x: number; y: number } | null>(null);
  const [isNameGroupDialogOpen, setIsNameGroupDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [pendingGroup, setPendingGroup] = useState<ComponentGroup | null>(null);
  const dragCanvasRef = useRef<HTMLDivElement>(null);

  const categories = ["all", "开发工具", "AI工具", "数据处理", "可视化"];

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstallComponent = (componentId: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === componentId ? { ...comp, isInstalled: true } : comp
    ));
    const component = components.find(c => c.id === componentId);
    toast.success(`${component?.name} 安装成功！`);
  };

  const handleUninstallComponent = (componentId: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === componentId ? { ...comp, isInstalled: false } : comp
    ));
    const component = components.find(c => c.id === componentId);
    toast.success(`${component?.name} 已卸载`);
  };

  const handleCreateComponent = () => {
    if (!newComponent.name || !newComponent.description) {
      toast.error("请填写组件名称和描述");
      return;
    }

    const component: Component = {
      id: `custom-${Date.now()}`,
      name: newComponent.name,
      description: newComponent.description,
      icon: <Settings className="w-6 h-6" />,
      category: newComponent.category || "开发工具",
      type: "custom",
      features: newComponent.features.split(",").map(f => f.trim()).filter(f => f),
      downloads: 0,
      rating: 0,
      tags: ["自定义"],
      isInstalled: false
    };

    setComponents(prev => [...prev, component]);
    setNewComponent({ name: "", description: "", category: "", features: "", uploadedFile: null });
    setIsCreateDialogOpen(false);
    toast.success("组件创建成功！");
  };

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) {
      toast.error("请输入AI生成提示");
      return;
    }

    // 模拟AI生成组件
    const aiComponent: Component = {
      id: `ai-${Date.now()}`,
      name: `AI生成组件`,
      description: `基于提示"${aiPrompt}"生成的智能组件`,
      icon: <Rocket className="w-6 h-6" />,
      category: "AI工具",
      type: "custom",
      features: ["AI生成", "智能功能", "自动化"],
      downloads: 0,
      rating: 0,
      tags: ["AI", "自动生成"],
      isInstalled: false
    };

    setComponents(prev => [...prev, aiComponent]);
    setAiPrompt("");
    setIsAIGenerateDialogOpen(false);
    toast.success("AI组件生成成功！");
  };

  // 拖拽相关方法
  const handleDragStart = (e: React.DragEvent, component: Component) => {
    setDraggedComponent(component);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", component.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    const rect = dragCanvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOverPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleDrop = (e: React.DragEvent, targetComponent?: Component) => {
    e.preventDefault();
    
    if (!draggedComponent) return;
    
    if (targetComponent && targetComponent.id !== draggedComponent.id) {
      // 创建应用组
      const newGroup: ComponentGroup = {
        id: `group-${Date.now()}`,
        name: `${draggedComponent.name} & ${targetComponent.name}`,
        components: [draggedComponent, targetComponent],
        position: dragOverPosition || { x: 200, y: 200 },
        isExpanded: false
      };
      
      setPendingGroup(newGroup);
      setIsNameGroupDialogOpen(true);
    }
    
    setDraggedComponent(null);
    setDragOverPosition(null);
  };

  const handleCreateGroup = () => {
    if (!pendingGroup || !groupName.trim()) {
      toast.error("请输入应用组名称");
      return;
    }

    const finalGroup = { ...pendingGroup, name: groupName };
    setComponentGroups(prev => [...prev, finalGroup]);
    
    // 将组件标记为已分组
    setComponents(prev => prev.map(comp => 
      finalGroup.components.some(gc => gc.id === comp.id) 
        ? { ...comp, groupId: finalGroup.id }
        : comp
    ));
    
    setGroupName("");
    setPendingGroup(null);
    setIsNameGroupDialogOpen(false);
    toast.success(`应用组"${finalGroup.name}"创建成功！`);
  };

  const handleExpandGroup = (groupId: string) => {
    setComponentGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, isExpanded: !group.isExpanded } : group
    ));
  };

  const handleRemoveFromGroup = (componentId: string, groupId: string) => {
    // 从组中移除组件
    setComponentGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const newComponents = group.components.filter(c => c.id !== componentId);
        if (newComponents.length < 2) {
          // 如果组中只剩一个组件，解散该组
          return null;
        }
        return { ...group, components: newComponents };
      }
      return group;
    }).filter(Boolean) as ComponentGroup[]);
    
    // 更新组件状态
    setComponents(prev => prev.map(comp => 
      comp.id === componentId ? { ...comp, groupId: undefined } : comp
    ));
    
    toast.success("组件已从应用组中移除");
  };

  const getUngroupedComponents = () => {
    return filteredComponents.filter(comp => !comp.groupId);
  };

  // 渲染应用组
  const renderComponentGroup = (group: ComponentGroup) => (
    <div key={group.id} className="relative">
      <Card 
        className="p-4 bg-purple-500/10 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
        onClick={() => handleExpandGroup(group.id)}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Folder className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">{group.name}</h3>
            <p className="text-sm text-purple-400">{group.components.length} 个组件</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-purple-400 hover:text-purple-300"
          >
            {group.isExpanded ? "收起" : "展开"}
          </Button>
        </div>
        
        {group.isExpanded && (
          <div className="space-y-2 mt-4 border-t border-purple-500/20 pt-4">
            {group.components.map(component => (
              <div key={component.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                    {component.icon}
                  </div>
                  <span className="text-sm text-white">{component.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromGroup(component.id, group.id);
                  }}
                  className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const renderComponentCard = (component: Component) => (
    <Card 
      key={component.id} 
      className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-400/40 transition-all duration-300 cursor-move"
      draggable
      onDragStart={(e) => handleDragStart(e, component)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, component)}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
          {component.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white truncate">{component.name}</h3>
            <Badge className={`text-xs ${
              component.type === "official" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
              component.type === "community" ? "bg-green-500/10 text-green-400 border-green-500/20" :
              "bg-purple-500/10 text-purple-400 border-purple-500/20"
            }`}>
              {component.type === "official" ? "官方" : 
               component.type === "community" ? "社区" : "自定义"}
            </Badge>
          </div>
          <p className="text-sm text-gray-400 mb-2 line-clamp-2">{component.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <span>⭐ {component.rating || "N/A"}</span>
            <span>📥 {component.downloads.toLocaleString()}</span>
            <span>🏷️ {component.category}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {component.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {component.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {component.isInstalled ? (
          <>
            <Button 
              size="sm" 
              className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
              disabled
            >
              ✓ 已安装
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              onClick={() => handleUninstallComponent(component.id)}
            >
              卸载
            </Button>
          </>
        ) : (
          <Button 
            size="sm" 
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
            onClick={() => handleInstallComponent(component.id)}
          >
            安装
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-violet-800">组件市场</h2>
          <p className="text-gray-600 text-lg">发现、安装和管理开发组件</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAIGenerateDialogOpen} onOpenChange={setIsAIGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-violet-100 hover:bg-violet-200 text-violet-700 border border-violet-300 font-medium px-4 py-2">
                🤖 AI生成组件
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white backdrop-blur-xl border border-violet-200">
              <DialogHeader>
                <DialogTitle className="text-violet-700">AI生成组件</DialogTitle>
                <DialogDescription className="text-gray-600">
                  描述您需要的组件功能，AI将为您生成相应的组件
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="例如：创建一个数据可视化组件，支持图表展示和数据导出..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="bg-violet-50 border-violet-200 text-violet-900"
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAIGenerateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleAIGenerate} className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6">
                  生成组件
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-violet-100 hover:bg-violet-200 text-violet-700 border border-violet-300 font-medium px-4 py-2">
                ➕ 新建组件
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white backdrop-blur-xl border border-violet-200">
              <DialogHeader>
                <DialogTitle className="text-violet-700">创建自定义组件</DialogTitle>
                <DialogDescription className="text-gray-600">
                  填写组件信息来创建您的自定义组件
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="组件名称"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-violet-50 border-violet-200 text-violet-900"
                />
                <Textarea
                  placeholder="组件描述"
                  value={newComponent.description}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-violet-50 border-violet-200 text-violet-900"
                />
                <Select value={newComponent.category} onValueChange={(value) => setNewComponent(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat !== "all").map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="功能特性（用逗号分隔）"
                  value={newComponent.features}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, features: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                />
                
                {/* 文件上传区域 */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">上传组件文件</label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept=".tsx,.jsx,.ts,.js,.zip"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewComponent(prev => ({ ...prev, uploadedFile: file }));
                        }
                      }}
                      className="hidden"
                      id="component-file-upload"
                    />
                    <label 
                      htmlFor="component-file-upload" 
                      className="cursor-pointer text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      📁 点击选择文件或拖拽文件到此处
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      支持 .tsx, .jsx, .ts, .js, .zip 文件
                    </p>
                    {newComponent.uploadedFile && (
                      <p className="text-green-400 text-sm mt-2">
                        已选择文件: {newComponent.uploadedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateComponent} className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6">
                  创建组件
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 搜索栏和分类 */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="搜索组件..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-violet-50 border-violet-200 text-violet-900 max-w-xs"
        />
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
          <TabsList className="bg-violet-50 border border-violet-200">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-violet-700 data-[state=active]:bg-violet-200 data-[state=active]:text-violet-900">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 组件列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map(component => (
          <Card key={component.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-xl p-6 border border-violet-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                {component.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-violet-800 mb-1">{component.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{component.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {component.tags.map(tag => (
                <Badge key={tag} className="bg-violet-100 text-violet-700 border-violet-200 text-xs font-medium">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2 items-center text-gray-500 text-sm">
                <span>下载量: <span className="text-violet-700 font-medium">{component.downloads}</span></span>
                <span>评分: <span className="text-violet-700 font-medium">{component.rating}</span></span>
              </div>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-4">
                {component.isInstalled ? '已安装' : '安装'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">没有找到匹配的组件</p>
        </div>
      )}

      {/* 应用组命名对话框 */}
      <Dialog open={isNameGroupDialogOpen} onOpenChange={setIsNameGroupDialogOpen}>
        <DialogContent className="bg-gray-900/90 backdrop-blur-xl border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-purple-400" />
              创建应用组
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              为您的应用组命名，方便管理和使用
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {pendingGroup && (
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-sm text-gray-300 mb-2">将要组合的组件：</p>
                <div className="flex gap-2">
                  {pendingGroup.components.map(comp => (
                    <div key={comp.id} className="flex items-center gap-2 bg-white/10 rounded px-2 py-1">
                      <div className="w-4 h-4">{comp.icon}</div>
                      <span className="text-xs text-white">{comp.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Input
              placeholder="输入应用组名称..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNameGroupDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={handleCreateGroup} 
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
            >
              <Folder className="w-4 h-4 mr-2" />
              创建应用组
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};