// This file is a **server component**. It only exports metadata and renders a client component.
import { Metadata } from 'next';
import { productAPI } from '@/lib/api';
import { type Product } from '@/types';
import ProductDetailClient from './ProductDetailClient';

// Generate SEO metadata for each product page
export const generateMetadata = async ({ params }: { params: { id: string } }): Promise<Metadata> => {
  try {
    const res = await productAPI.getById(params.id);
    const product: Product = res.data.data;
    const description = product.description?.slice(0, 160) || `${product.name} – premium meat cut available now.`;
    const imageUrl = product.images?.[0]?.url || '/default-product.jpg';
    return {
      title: product.name,
      description,
      openGraph: {
        title: product.name,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${params.id}`,
        siteName: 'CARN‑X',
        images: [{ url: imageUrl, width: 800, height: 600 }],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description,
        images: [imageUrl],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (e) {
    return {
      title: 'Product not found',
      description: 'Product details could not be loaded.',
    };
  }
};

// Server component rendering the client‑side product detail UI
export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient productId={params.id} />;
}
