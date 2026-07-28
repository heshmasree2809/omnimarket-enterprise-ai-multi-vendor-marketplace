import React, { useState, useEffect } from 'react';
import { Product, Review, AIReviewSummaryResult } from '../types/marketplace';
import { useMarketplace } from '../context/MarketplaceContext';
import { fetchAIReviewSummary } from '../services/aiService';
import { Star, ThumbsUp, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReviewSectionProps {
  product: Product;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ product }) => {
  const { reviews, addReview } = useMarketplace();
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const [aiSummary, setAiSummary] = useState<AIReviewSummaryResult | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadSummary() {
      setLoadingAI(true);
      const res = await fetchAIReviewSummary(product.title, productReviews);
      if (isMounted) {
        setAiSummary(res);
        setLoadingAI(false);
      }
    }
    loadSummary();
    return () => { isMounted = false; };
  }, [product.id]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) return;

    addReview({
      productId: product.id,
      userId: 'u-current',
      userName: 'Verified Buyer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      rating: newRating,
      title: newTitle,
      comment: newComment,
      verifiedPurchase: true,
    });

    setNewTitle('');
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="space-y-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rating Big Badge */}
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">{product.rating}</span>
          <div className="flex items-center text-amber-400 my-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'}`} />
            ))}
          </div>
          <span className="text-xs text-zinc-500 font-medium">Based on {product.reviewCount} verified buyer reviews</span>
        </div>

        {/* AI Review Insights Summary Box */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-zinc-900 p-6 rounded-2xl border border-indigo-500/30 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>AI Review Summary</span>
            </div>
            {loadingAI && <span className="text-[10px] text-zinc-400 animate-pulse">Analyzing customer sentiment...</span>}
          </div>

          {aiSummary ? (
            <div className="space-y-3">
              <p className="text-zinc-200 leading-relaxed font-medium">{aiSummary.summary}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Key Highlights
                  </span>
                  <ul className="space-y-0.5 text-zinc-300">
                    {aiSummary.pros.map((p, i) => <li key={i}>• {p}</li>)}
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-amber-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Considerations
                  </span>
                  <ul className="space-y-0.5 text-zinc-400">
                    {aiSummary.cons.map((c, i) => <li key={i}>• {c}</li>)}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-500/20 text-zinc-300 font-semibold text-[11px]">
                Verdict: <span className="text-indigo-300">{aiSummary.verdict}</span>
              </div>
            </div>
          ) : (
            <p className="text-zinc-400">Generating AI review analysis...</p>
          )}
        </div>

      </div>

      {/* Add Review Form */}
      <form onSubmit={handleSubmitReview} className="bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Write a Customer Review</h4>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-500">Your Rating:</span>
          <div className="flex text-amber-400 cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setNewRating(star)}
                className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'}`}
              />
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="Headline / Summary title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <textarea
          placeholder="Share details about performance, build quality, sizing, or experience..."
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
        >
          Submit Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Customer Reviews ({productReviews.length})</h4>
        
        {productReviews.length === 0 ? (
          <p className="text-xs text-zinc-500">No reviews yet for this product. Be the first to review!</p>
        ) : (
          productReviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="ml-2 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-medium">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-zinc-400">{rev.date}</span>
              </div>

              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'}`} />
                ))}
              </div>

              <h5 className="font-bold text-zinc-900 dark:text-white">{rev.title}</h5>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
