import { useState } from "react";
import { X } from "lucide-react";

export default function FeedbackForm({ open, onClose }) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    
    // we literally scammin our users here with a fake delay as if we doing something ( •̀ ω •́ )y
    // when submit is clicked after one sec it run the first setTimeout, after 2 sec it run the second setTimeout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        // basically wait 2 sec before closing the modal
        setFeedback(""); // clear bc the next time user open the modal we want it to be empty
        setIsSubmitted(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-icy rounded-[13px] p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* This first part is what happens when user press submit */}
        {isSubmitted ? (
          <div className="py-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-hornbill text-twilight font-black mb-2">Thank You!</h2>
            <p className="text-center text-twilight">Your feedback has been received.</p>
          </div>
        ) : (
            <>
            {/* This part is what happens when user open the modal and have not submitted */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-hornbill font-black text-twilight">
                Send Feedback
              </h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} className="text-twilight" />
              </button>
            </div>
            
            <p className="text-twilight mb-4">
              We'd love to hear your thoughts about DebtMate! Please share any feedback, suggestions, or issues you've encountered.
            </p>
            
            <div className="mb-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Type your feedback here..."
                className="w-full px-4 py-3 text-twilight rounded-[13px] border border-twilight bg-backg outline-none resize-none"
                rows={6}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!feedback.trim() || isSubmitting}
                className="flex-1 py-3 rounded-[13px] bg-twilight text-white font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Submit Feedback"}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-[13px] border border-twilight text-twilight font-semibold"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}