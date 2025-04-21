'use client';
import React, {useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {toast} from '@/hooks/use-toast';
import {Icons} from '@/components/icons';
import {useTheme} from 'next-themes';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {explainCode} from '@/ai/flows/explain-code';
import {customizeExplanation} from '@/ai/flows/customize-explanation';
import {cn} from '@/lib/utils';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const Home = () => {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detailLevel, setDetailLevel] = useState('concise');
  const {theme} = useTheme();

  const handleExplainCode = async () => {
    setIsLoading(true);
    try {
      const result = await explainCode({code, explanationLevel: detailLevel});
      setExplanation(result.explanation);
    } catch (error: any) {
      console.error('Error explaining code:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to explain code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomizeExplanation = async () => {
    setIsLoading(true);
    try {
      const result = await customizeExplanation({code, detailLevel});
      setExplanation(result.explanation);
    } catch (error: any) {
      console.error('Error customizing explanation:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to customize explanation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyExplanation = () => {
    navigator.clipboard.writeText(explanation);
    toast({
      title: 'Copied!',
      description: 'Explanation copied to clipboard.',
    });
  };

  const handleClearCode = () => {
    setCode('');
    setExplanation('');
  };

  const explanationSource = () => {
    if (detailLevel == 'concise') {
      return handleExplainCode;
    } else {
      return handleCustomizeExplanation;
    }
  }

  return (
    <TooltipProvider>
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl bg-card shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Code Whisperer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="code" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Enter Code
              </label>

              <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" size="icon" onClick={handleClearCode} disabled={isLoading}>
                    <Icons.trash className="h-4 w-4"/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Textarea
              id="code"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-background border-input rounded-md focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Select onValueChange={setDetailLevel} defaultValue={detailLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Explanation Level"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={explanationSource()} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors">
              {isLoading ? (
                <>
                  <Icons.loader className="mr-2 h-4 w-4 animate-spin"/>
                  Explaining...
                </>
              ) : (
                'Explain Code'
              )}
            </Button>
          </div>

          {explanation && (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="explanation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Explanation
                </label>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="icon" onClick={handleCopyExplanation} disabled={isLoading}>
                      <Icons.copy className="h-4 w-4"/>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy Explanation</TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="explanation"
                value={explanation}
                readOnly
                rows={10}
                className="bg-secondary rounded-md border-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 text-2xl shadow-md"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
};

export default Home;
