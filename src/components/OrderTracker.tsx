import React, { useState } from 'react';
import {
  Check,
  Package,
  Truck,
  Navigation,
  Home,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Sliders,
  Box,
} from 'lucide-react';
import { Order, OrderStatus } from '../types/marketplace';
import { useToast } from '../context/ToastContext';

interface OrderTrackerProps {
  order: Order;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
  showAdminControls?: boolean;
}

interface StepDefinition {
  id: OrderStatus | 'out_for_delivery';
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  stepIndex: number;
}

const TRACKING_STEPS: StepDefinition[] = [
  {
    id: 'pending',
    label: 'Order Confirmed',
    sublabel: 'Payment verified',
    icon: Check,
    stepIndex: 0,
  },
  {
    id: 'processing',
    label: 'Processing & Packed',
    sublabel: 'In fulfillment center',
    icon: Package,
    stepIndex: 1,
  },
  {
    id: 'shipped',
    label: 'Shipped & In Transit',
    sublabel: 'Carrier picked up',
    icon: Truck,
    stepIndex: 2,
  },
  {
    id: 'out_for_delivery',
    label: 'Out for Delivery',
    sublabel: 'On local courier vehicle',
    icon: Navigation,
    stepIndex: 3,
  },
  {
    id: 'delivered',
    label: 'Delivered',
    sublabel: 'Handed over / Dropped off',
    icon: Home,
    stepIndex: 4,
  },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  order,
  onUpdateStatus,
  showAdminControls = true,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'timeline' | 'map'>('progress');

  // Determine current active step index (0 to 4)
  const getCurrentStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 2;
    }
  };

  const currentStep = getCurrentStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  // Calculate percentage for progress line (0% to 100%)
  const progressPercentage = isCancelled
    ? 0
    : Math.min(100, Math.max(0, (currentStep / (TRACKING_STEPS.length - 1)) * 100));

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    showToast('Tracking number copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate realistic timeline events based on order status
  const getTimelineEvents = () => {
    const createdDate = new Date(order.createdAt);
    const formatDate = (date: Date, hoursOffset = 0) => {
      const d = new Date(date.getTime() + hoursOffset * 3600 * 1000);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const events = [];

    events.push({
      title: 'Order Confirmed & Placed',
      description: `Payment authorized via ${order.paymentMethod.replace('_', ' ').toUpperCase()}`,
      location: 'Online Store Systems',
      time: formatDate(createdDate, 0),
      done: true,
      icon: Check,
    });

    if (currentStep >= 1 || order.status === 'delivered') {
      events.push({
        title: 'Fulfillment Center Processing',
        description: 'Items scanned, packed in eco-friendly protective box, and shipping label attached',
        location: 'Warehouse Hub #4 (San Jose, CA)',
        time: formatDate(createdDate, 4),
        done: true,
        icon: Package,
      });
    }

    if (currentStep >= 2 || order.status === 'delivered') {
      events.push({
        title: `Package Departed Carrier Facility (${order.trackingCarrier})`,
        description: `Shipment in transit on truck #${order.id.slice(-4)}. Tracking ID: ${order.trackingNumber}`,
        location: 'Regional Logistics Center (Oakland, CA)',
        time: formatDate(createdDate, 18),
        done: true,
        icon: Truck,
      });
    }

    if (currentStep >= 3 || order.status === 'delivered') {
      events.push({
        title: 'Out for Final Delivery',
        description: 'Courier driver assigned to local route. Estimated arrival window within 2 hours.',
        location: 'Local Postal Station',
        time: formatDate(createdDate, 28),
        done: currentStep >= 3,
        icon: Navigation,
      });
    }

    if (currentStep === 4 || order.status === 'delivered') {
      events.push({
        title: 'Package Delivered',
        description: 'Package placed near front door / reception area. Photo confirmation recorded.',
        location: `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
        time: formatDate(createdDate, 32),
        done: true,
        icon: Home,
      });
    }

    if (isCancelled) {
      events.push({
        title: 'Order Cancelled',
        description: 'Order was cancelled and refund process initiated.',
        location: 'Customer Service Center',
        time: formatDate(createdDate, 2),
        done: true,
        icon: AlertCircle,
        isError: true,
      });
    }

    return events.reverse();
  };

  const timelineEvents = getTimelineEvents();

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
      
      {/* HEADER BAR */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider border border-indigo-400/30">
              Live Shipment Status
            </span>
            <span className="text-zinc-400 text-xs">Order ID: <strong className="text-white font-mono">{order.id}</strong></span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-2">
            {isCancelled ? (
              <span className="text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-5 h-5" /> Order Cancelled
              </span>
            ) : order.status === 'delivered' ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> Delivered On Time
              </span>
            ) : (
              <span className="text-white flex items-center gap-1.5">
                <Truck className="w-5 h-5 text-indigo-400 animate-bounce" /> In Transit & Tracking
              </span>
            )}
          </h3>
        </div>

        {/* Tracking Number Badge with Copy */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-2xl border border-zinc-700/80 shrink-0">
          <div className="text-left">
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{order.trackingCarrier} Tracking</p>
            <p className="text-xs font-mono font-bold text-indigo-300">{order.trackingNumber}</p>
          </div>
          <button
            onClick={copyTrackingNumber}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-zinc-200 hover:text-white transition-colors relative"
            title="Copy Tracking Number"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ESTIMATED DELIVERY BANNER */}
      {!isCancelled && (
        <div className="px-6 py-3.5 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border-b border-zinc-800 text-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Estimated Delivery: <strong className="text-white font-extrabold text-sm underline decoration-indigo-500">{order.estimatedDelivery}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>To: {order.shippingAddress.city}, {order.shippingAddress.state}</span>
            </span>
            <span className="hidden sm:inline border-l border-zinc-700 pl-3">
              Items: <strong>{order.items.reduce((acc, i) => acc + i.quantity, 0)}</strong>
            </span>
          </div>
        </div>
      )}

      {/* TAB NAVIGATION */}
      <div className="px-6 pt-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('progress')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'progress'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Progress Bar</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Activity Log ({timelineEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'map'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Live Route Map</span>
        </button>
      </div>

      {/* MAIN CONTENT PANELS */}
      <div className="p-6">
        
        {/* TAB 1: VISUAL STEP PROGRESS BAR */}
        {activeTab === 'progress' && (
          <div className="space-y-8">
            
            {/* CANCELLED STATE NOTICE */}
            {isCancelled ? (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 shrink-0 text-rose-500" />
                <div>
                  <h4 className="font-bold text-sm">Shipment Halted & Cancelled</h4>
                  <p className="text-xs opacity-90">This order has been cancelled. If you believe this is an error or need assistance, please contact customer support.</p>
                </div>
              </div>
            ) : (
              /* PROGRESS BAR TRACK */
              <div className="relative py-4 px-2">
                
                {/* Background Line */}
                <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full z-0" />

                {/* Animated Filled Progress Line */}
                <div
                  className="absolute top-1/2 left-6 -translate-y-1/2 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 rounded-full z-0 transition-all duration-700 ease-out"
                  style={{ width: `calc(${progressPercentage}% - 1rem)` }}
                />

                {/* Steps Circles */}
                <div className="relative z-10 flex items-center justify-between">
                  {TRACKING_STEPS.map((step) => {
                    const isCompleted = step.stepIndex < currentStep || order.status === 'delivered';
                    const isActive = step.stepIndex === currentStep && order.status !== 'delivered';
                    const IconComponent = step.icon;

                    return (
                      <div key={step.id} className="flex flex-col items-center group">
                        
                        {/* Circle Icon */}
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg ${
                            isCompleted
                              ? 'bg-emerald-500 text-white shadow-emerald-500/20 scale-100'
                              : isActive
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 scale-110 animate-pulse shadow-indigo-600/30'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                          ) : (
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                          )}
                        </div>

                        {/* Step Labels */}
                        <div className="text-center mt-3 max-w-[90px] sm:max-w-[120px]">
                          <p
                            className={`text-xs font-bold transition-colors ${
                              isCompleted || isActive
                                ? 'text-zinc-900 dark:text-white'
                                : 'text-zinc-400 dark:text-zinc-600'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 hidden sm:block mt-0.5">
                            {step.sublabel}
                          </p>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* STATUS SUMMARY CARD */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Carrier Logistics</p>
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    {order.trackingCarrier} Express • Ground Priority
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://www.google.com/search?q=${order.trackingCarrier}+tracking+${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Carrier Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => showToast('Connecting to Carrier Support Representative...', 'info')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Support</span>
                </button>
              </div>
            </div>

            {/* DEMO STATUS SIMULATOR (FOR ADMIN / TESTER) */}
            {showAdminControls && onUpdateStatus && (
              <div className="pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Interactive Status Simulator
                  </span>
                  <span className="text-[10px] text-zinc-500">Test live state updates</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(order.id, st);
                        showToast(`Order status updated to "${st.toUpperCase()}"`, 'success');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        order.status === st
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: DETAILED TIMELINE LOG */}
        {activeTab === 'timeline' && (
          <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
            {timelineEvents.map((evt, idx) => {
              const EvtIcon = evt.icon;
              return (
                <div key={idx} className="relative group">
                  
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      evt.isError
                        ? 'bg-rose-500 border-rose-600 text-white'
                        : evt.done
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-400 text-zinc-500'
                    }`}
                  >
                    <EvtIcon className="w-3 h-3" />
                  </div>

                  {/* Event Details Box */}
                  <div className="bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white">
                        {evt.title}
                      </h4>
                      <span className="text-[10px] font-mono font-semibold text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                        {evt.time}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                      {evt.description}
                    </p>

                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 pt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{evt.location}</span>
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: LIVE ROUTE MAP VECTOR REPRESENTATION */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="relative w-full h-52 sm:h-64 rounded-2xl bg-slate-950 border border-zinc-800 overflow-hidden flex items-center justify-center p-4">
              
              {/* Stylized Map Grid overlay */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Route Line */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 50 160 Q 200 40, 500 120"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
              </svg>

              {/* Origin Marker */}
              <div className="absolute left-[10%] bottom-[20%] flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-indigo-400 text-indigo-300 flex items-center justify-center text-xs font-bold shadow-lg">
                  <Box className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-zinc-400 mt-1 bg-slate-900/90 px-2 py-0.5 rounded border border-zinc-800">
                  Fulfillment Hub
                </span>
              </div>

              {/* Active Truck Position Marker */}
              <div className="absolute left-[45%] top-[25%] flex flex-col items-center animate-bounce">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-white bg-indigo-600 px-2.5 py-0.5 rounded-full mt-1 shadow">
                  In Transit
                </span>
              </div>

              {/* Destination Marker */}
              <div className="absolute right-[10%] bottom-[35%] flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-950 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-xs font-bold shadow-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-zinc-400 mt-1 bg-slate-900/90 px-2 py-0.5 rounded border border-zinc-800">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </span>
              </div>

            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                GPS Package Tracking Active
              </span>
              <span className="font-mono text-zinc-400 text-[10px]">Signal Updated 2 mins ago</span>
            </div>
          </div>
        )}

      </div>

      {/* ITEMS IN SHIPMENT FOOTER */}
      <div className="p-4 bg-zinc-50/80 dark:bg-zinc-950/80 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="font-bold text-zinc-500 shrink-0">Shipment Items:</span>
          {order.items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0">
              <img src={it.productImage} alt={it.productTitle} className="w-6 h-6 rounded-lg object-cover" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[120px]">{it.productTitle}</span>
              <span className="text-zinc-400 font-mono text-[10px]">x{it.quantity}</span>
            </div>
          ))}
        </div>

        <div className="font-extrabold text-zinc-900 dark:text-white shrink-0">
          Total: ${order.totalAmount.toFixed(2)}
        </div>
      </div>

    </div>
  );
};
