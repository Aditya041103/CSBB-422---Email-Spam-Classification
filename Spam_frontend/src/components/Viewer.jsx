import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { 
  Mail, 
  Calendar, 
  Trash2, 
  Shield, 
  X, 
  AlertTriangle,
  CheckCircle 
} from "lucide-react";

export default function Viewer({ selected, setSelected, sendFeedback, activeFolder }) {
  if (!selected) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Mail className="h-16 w-16 mb-4 opacity-50 mx-auto" />
          <h3 className="text-lg font-medium mb-2">Select an email to read</h3>
          <p className="text-sm">Choose an email from the list to view its contents</p>
        </div>
      </div>
    );
  }

  const senderInitial = selected.from?.charAt(0).toUpperCase() || "?";
  const isSpam = selected.label === "spam";

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Email Header */}
        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                    {senderInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <CardTitle className="text-xl text-blue-900">
                    {selected.subject || "(no subject)"}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-blue-600">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">From:</span> {selected.from}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selected.ts || Date.now()).toLocaleDateString([], { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant={isSpam ? "destructive" : "default"} className="gap-1">
                  {isSpam ? (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      Spam
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Safe
                    </>
                  )}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Email Body */}
        <Card>
          <CardContent className="p-6">
            <div clascd sName="w-full">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed break-words">
                {selected.body}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Actions for this email:
              </div>
              <div className="flex gap-3">
                {activeFolder === "inbox" ? (
                  <Button
                    onClick={() => sendFeedback(selected, "spam")}
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Mark as Spam
                  </Button>
                ) : (
                  <Button
                    onClick={() => sendFeedback(selected, "not_spam")}
                    variant="default"
                    size="sm"
                    className="gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Not Spam
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
