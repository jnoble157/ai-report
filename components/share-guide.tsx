import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle, AlertTriangle } from "lucide-react";

export function ShareGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8">
          <HelpCircle className="h-4 w-4" />
          <span>How to share a conversation</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to share a ChatGPT conversation</DialogTitle>
          <DialogDescription>
            Follow these steps to properly share your conversation
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Step 1: Open your conversation in ChatGPT</h3>
            <p className="text-sm text-muted-foreground">
              Navigate to chat.openai.com and open the conversation you want to share
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Step 2: Click the "Share" button</h3>
            <p className="text-sm text-muted-foreground">
              Look for the share icon (square with arrow) in the top-right of your conversation
            </p>
            <div className="bg-muted p-2 rounded">
              <code className="text-xs">Share button ↗️</code>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Step 3: Enable "Share with web" toggle</h3>
            <p className="text-sm text-muted-foreground">
              This critical step makes your conversation publicly accessible
            </p>
            <div className="bg-red-50 dark:bg-red-950 p-3 rounded border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold">THIS IS THE MOST IMPORTANT STEP</p>
                  <p className="text-xs mt-1">After clicking "Share", you'll see a popup dialog with a toggle switch:</p>
                  <div className="flex items-center mt-2 bg-white dark:bg-gray-800 p-2 rounded">
                    <div className="w-8 h-4 bg-green-500 rounded-full relative mr-2">
                      <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-0.5" />
                    </div>
                    <span className="text-xs font-medium">Share with web</span>
                  </div>
                  <p className="text-xs mt-2">The toggle must be <span className="font-bold underline">ON (green)</span> as shown above</p>
                  <p className="text-xs mt-1 font-bold">If this toggle is off, your link will not work with AI Report</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Step 4: Copy the shared link</h3>
            <p className="text-sm text-muted-foreground">
              Click "Create shared link" and copy the full URL
            </p>
            <div className="bg-muted p-2 rounded">
              <code className="text-xs break-all">https://chat.openai.com/share/abc123-example-conversation</code>
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t">
            <h3 className="text-sm font-medium">Can't share with web?</h3>
            <p className="text-xs text-muted-foreground">
              If you don't see the "Share with web" toggle or can't enable it:
            </p>
            <ul className="text-xs list-disc pl-4 space-y-1">
              <li>You might be using a free plan that restricts public sharing</li>
              <li>Your organization might have disabled public sharing</li>
              <li>Try creating a new conversation in a different account</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button type="button">Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 