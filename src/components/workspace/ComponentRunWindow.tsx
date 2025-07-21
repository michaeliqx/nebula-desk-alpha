import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Minus, Square, Terminal, FileText, Rocket, Settings } from "lucide-react";

interface ComponentRunWindowProps {
  componentId: string;
  componentName: string;
  componentType: "terminal" | "jupyter" | "model-deploy" | "tensorboard" | "code-editor" | "custom";
  onClose: () => void;
  onMinimize?: () => void;
}

export const ComponentRunWindow = ({
  componentId,
  componentName,
  componentType,
  onClose,
  onMinimize
}: ComponentRunWindowProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [command, setCommand] = useState("");

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    onMinimize?.();
  };

  const handleCommand = () => {
    if (!command.trim()) return;
    
    setOutput(prev => [...prev, `$ ${command}`, `执行命令: ${command}`, "命令执行完成"]);
    setCommand("");
  };

  const renderContent = () => {
    switch (componentType) {
      case "terminal":
        return (
          <div className="h-full flex flex-col bg-black/90 text-green-400 font-mono text-sm">
            <div className="flex-1 p-4 overflow-auto">
              {output.map((line, index) => (
                <div key={index} className="mb-1">{line}</div>
              ))}
              {output.length === 0 && (
                <div className="text-gray-500">Terminal ready. Type commands below...</div>
              )}
            </div>
            <div className="border-t border-gray-700 p-2 flex">
              <span className="text-green-400 mr-2">$</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCommand()}
                className="flex-1 bg-transparent text-green-400 outline-none"
                placeholder="输入命令..."
              />
            </div>
          </div>
        );

      case "jupyter":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 p-4 space-y-4">
              <div className="border border-border rounded p-3">
                <div className="text-sm text-muted-foreground mb-2">Code Cell [1]:</div>
                <Textarea
                  placeholder="输入Python代码..."
                  className="font-mono text-sm bg-background/50"
                  rows={3}
                />
                <Button size="sm" className="mt-2">运行</Button>
              </div>
              <div className="border border-border rounded p-3 bg-muted/20">
                <div className="text-sm text-muted-foreground mb-2">Output:</div>
                <div className="font-mono text-sm">Hello World!</div>
              </div>
            </div>
          </div>
        );

      case "model-deploy":
        return (
          <div className="h-full p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-blue-500/20 text-blue-400">模型状态</Badge>
              <Badge className="bg-green-500/20 text-green-400">运行中</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">模型名称</label>
                <input
                  type="text"
                  defaultValue="ml-model-v1"
                  className="w-full p-2 rounded border bg-background text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">端口</label>
                <input
                  type="text"
                  defaultValue="8080"
                  className="w-full p-2 rounded border bg-background text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API端点</label>
              <div className="p-2 bg-muted/50 rounded font-mono text-sm">
                http://localhost:8080/predict
              </div>
            </div>
            <Button className="w-full">重新部署</Button>
          </div>
        );

      case "tensorboard":
        return (
          <div className="h-full p-4">
            <div className="h-full bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">TensorBoard 可视化面板</p>
                <p className="text-sm text-muted-foreground mt-2">
                  监控训练指标和模型性能
                </p>
              </div>
            </div>
          </div>
        );

      case "code-editor":
        return (
          <div className="h-full flex flex-col">
            <div className="border-b p-2 text-sm text-muted-foreground">
              📁 main.py
            </div>
            <div className="flex-1">
              <Textarea
                className="h-full resize-none font-mono text-sm border-0 rounded-none"
                placeholder="# 在这里编写代码..."
                defaultValue={`import numpy as np
import pandas as pd

def main():
    print("Hello, World!")
    
if __name__ == "__main__":
    main()`}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <p>组件运行界面</p>
            </div>
          </div>
        );
    }
  };

  const getIcon = () => {
    switch (componentType) {
      case "terminal": return <Terminal className="w-4 h-4" />;
      case "jupyter": return <FileText className="w-4 h-4" />;
      case "model-deploy": return <Rocket className="w-4 h-4" />;
      case "tensorboard": return <Settings className="w-4 h-4" />;
      case "code-editor": return <FileText className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={handleMinimize}
          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
        >
          {getIcon()}
          <span className="ml-2">{componentName}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <Card className="w-[800px] h-[600px] bg-white/95 backdrop-blur-xl border border-violet-200">
        {/* 窗口标题栏 */}
        <div className="flex items-center justify-between p-3 border-b border-violet-200 bg-violet-50">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="font-medium text-violet-700">{componentName}</span>
            <Badge variant="outline" className="text-xs text-violet-600 border-violet-300">
              {componentType}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMinimize}
              className="w-8 h-8 p-0 hover:bg-yellow-500/20"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="w-8 h-8 p-0 hover:bg-red-500/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 窗口内容 */}
        <div className="h-[calc(100%-60px)]">
          {renderContent()}
        </div>
      </Card>
    </div>
  );
};