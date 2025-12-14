import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// --- PRO ICONS ---
const Icons = {
  Share: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>,
  WhatsApp: () => <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
};

function ProductDetail() {
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  
  // Ref for swipe container
  const sliderRef = useRef(null);

  const SELLER_NUMBER = "919491950909"; 

  useEffect(() => {
    fetch('https://bramari.onrender.com/products').then(res => res.json()).then(allProducts => {
        const current = allProducts.find(p => p._id === id);
        setProduct(current);
        setLoading(false);
      });
      setCurrentImageIndex(0);
      window.scrollTo(0, 0);
  }, [id]);

  if (loading || !product) return <div className="text-center mt-20 text-saree-maroon font-serif text-xl">Finding Saree...</div>;

  const buyNow = () => {
    const message = `Hello! I am interested in buying this Saree:\n\n*Title:* ${product.title}\n*Price:* ₹${product.price}\n*Fabric:* ${product.fabric}\n*Color:* ${product.color}\n\n🔗 *Link:* ${window.location.href}\n\nIs this available?`;
    window.open(`https://wa.me/${SELLER_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product.title, text: `Check out this beautiful saree: ${product.title} only at Bramari!`, url: window.location.href }); } catch (error) { console.log('Error sharing', error); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied to Clipboard! 📋");
    }
  };

  // --- SWIPE LOGIC ---
  const handleScroll = () => {
    if (sliderRef.current) {
        const index = Math.round(sliderRef.current.scrollLeft / sliderRef.current.offsetWidth);
        setCurrentImageIndex(index);
    }
  };

  const scrollToImage = (index) => {
    if (sliderRef.current) {
        sliderRef.current.scrollTo({
            left: sliderRef.current.offsetWidth * index,
            behavior: 'smooth'
        });
        setCurrentImageIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-saree-cream pb-20 font-sans relative">
      <Toaster />

      {/* FULL SCREEN MODAL */}
      {fullScreenImage && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center p-4 animate-fadeIn">
          <button onClick={() => setFullScreenImage(null)} className="absolute top-6 right-6 text-white hover:text-gray-300 transition"><Icons.Close /></button>
          <img src={fullScreenImage} alt="Full Screen" className="max-w-full max-h-screen object-contain" />
        </div>
      )}
      
      {/* Navbar */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-50 flex justify-between items-center px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-saree-maroon font-bold hover:opacity-80 transition">
           <Icons.ArrowLeft />
           <span className="hidden md:inline">Back to Collection</span>
           <img src="/logo.jpg" alt="Bramari" className="h-12 w-12 rounded-full border border-saree-gold md:hidden" />
        </Link>
        <h1 className="md:hidden text-xl font-serif font-bold text-saree-maroon">Bramari</h1>
      </div>
      
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden grid md:grid-cols-2 gap-0 mb-16">
          
          {/* LEFT: SWIPEABLE IMAGE SLIDER */}
          <div className="relative bg-gray-50 h-[500px] md:h-[600px] group border-r border-gray-100">
            
            {/* The Scroll Container (Native Swipe) */}
            <div 
                ref={sliderRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            >
                {product.images.map((img, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-4">
                        <img 
                          src={img} 
                          alt={`View ${idx + 1}`} 
                          className="max-h-full max-w-full object-contain cursor-zoom-in drop-shadow-md"
                          onClick={() => setFullScreenImage(img)}
                        />
                    </div>
                ))}
            </div>

            {/* DOTS (Synced with Swipe) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 p-2 rounded-full bg-white/30 backdrop-blur-sm">
              {product.images.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => scrollToImage(idx)} 
                  className={`rounded-full cursor-pointer shadow transition-all duration-300 ${idx === currentImageIndex ? 'w-3 h-3 bg-saree-maroon scale-110' : 'w-2 h-2 bg-gray-400 hover:bg-gray-600'}`}
                ></div>
              ))}
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="flex justify-between items-start">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{product.fabric} • {product.occasion}</div>
                <button onClick={handleShare} className="text-gray-400 hover:text-saree-maroon transition p-2 rounded-full hover:bg-gray-100" title="Share"><Icons.Share /></button>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-saree-maroon mb-6 leading-tight">{product.title}</h1>
            <p className="text-gray-600 italic leading-relaxed mb-8 text-lg">"{product.description}"</p>

            <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-600 mb-8 border-t border-b border-gray-100 py-6">
               <div><span className="font-bold text-gray-900 block">Color</span> {product.color}</div>
               <div><span className="font-bold text-gray-900 block">Pattern</span> {product.pattern}</div>
               <div><span className="font-bold text-gray-900 block">Stock</span> Available</div>
               <div><span className="font-bold text-gray-900 block">Delivery</span> 3-5 Days</div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-3xl font-serif font-bold text-gray-900 mb-2">₹{product.price.toLocaleString('en-IN')}</div>
              <div className="flex gap-4">
                  <button onClick={buyNow} className="flex-1 bg-green-600 text-white text-lg font-bold py-4 rounded-lg shadow-lg hover:bg-green-700 transition flex justify-center items-center gap-2">
                    <Icons.WhatsApp /> Order on WhatsApp
                  </button>
                  <button onClick={handleShare} className="bg-gray-100 text-gray-700 px-6 py-4 rounded-lg font-bold hover:bg-gray-200 transition border border-gray-200 flex items-center gap-2">
                    <Icons.Share /> Share
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;