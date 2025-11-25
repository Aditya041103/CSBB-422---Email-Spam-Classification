import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react";

export default function ClassificationModal({ 
  isOpen, 
  onClose, 
  classificationResult,
  recipientEmail 
}) {
  if (!classificationResult) return null;

  const {
    label,
    raw_prediction,
    spam_probability,
    ham_probability
  } = classificationResult;

  const isSpam = label === "spam";
  const spamPercentage = Math.round(spam_probability * 100);
  const hamPercentage = Math.round(ham_probability * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-blue-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900">
            {isSpam ? (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                Email Classified as Spam
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Email Sent Successfully
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            Your email to <strong>{recipientEmail}</strong> has been analyzed and delivered.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Classification Result */}
          <div className={`p-4 rounded-lg border-2 ${
            isSpam 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isSpam ? (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              ) : (
                <Shield className="h-4 w-4 text-green-600" />
              )}
              <span className={`font-semibold text-sm ${
                isSpam ? 'text-red-700' : 'text-green-700'
              }`}>
                Classification: {isSpam ? 'SPAM' : 'NOT SPAM'}
              </span>
            </div>
            <p className={`text-xs ${
              isSpam ? 'text-red-600' : 'text-green-600'
            }`}>
              {isSpam 
                ? 'This email has been delivered to the recipient\'s spam folder.'
                : 'This email has been delivered to the recipient\'s inbox.'
              }
            </p>
          </div>

          {/* Probability Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 text-sm">Confidence Scores</h4>
            
            {/* Spam Probability */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Spam Probability</span>
                <span className="text-sm font-medium text-red-600">{spamPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${spamPercentage}%` }}
                />
              </div>
            </div>

            {/* Ham (Not Spam) Probability */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Not Spam Probability</span>
                <span className="text-sm font-medium text-green-600">{hamPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${hamPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Technical Details (Optional) */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-700 text-sm mb-2">Technical Details</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Raw Prediction: <span className="font-mono">{raw_prediction}</span></div>
              <div>Algorithm: Machine Learning Classification</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}