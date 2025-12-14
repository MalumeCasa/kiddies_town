import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InvoiceTable } from "@/components/Tables/invoice-table";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { TopProducts } from "@/components/Tables/top-products";
import { TopProductsSkeleton } from "@/components/Tables/top-products/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tables Page | Next.js E-Commerce Dashboard",
  description: "View tables and data in your dashboard",
};

// Mock data fetching functions
async function getTopChannelsData() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { 
      name: 'Organic Search', 
      visitors: 4521, 
      revenues: 12542, 
      sales: 324, 
      conversion: 7.2,
      logo: '/images/channels/organic-search.png'
    },
    { 
      name: 'Direct', 
      visitors: 3254, 
      revenues: 9876, 
      sales: 245, 
      conversion: 7.5,
      logo: '/images/channels/direct.png'
    },
    { 
      name: 'Social Media', 
      visitors: 2876, 
      revenues: 7564, 
      sales: 198, 
      conversion: 6.9,
      logo: '/images/channels/social-media.png'
    },
    { 
      name: 'Email', 
      visitors: 1987, 
      revenues: 5432, 
      sales: 143, 
      conversion: 7.2,
      logo: '/images/channels/email.png'
    },
    { 
      name: 'Referral', 
      visitors: 1654, 
      revenues: 4321, 
      sales: 98, 
      conversion: 5.9,
      logo: '/images/channels/referral.png'
    },
  ];
}

async function getTopProductsData() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return [
    { 
      name: 'iPhone 15 Pro', 
      category: 'Electronics', 
      price: 999, 
      sold: 452, 
      profit: 54210,
      image: '/images/products/iphone-15-pro.png'
    },
    { 
      name: 'MacBook Air M2', 
      category: 'Electronics', 
      price: 1099, 
      sold: 325, 
      profit: 35675,
      image: '/images/products/macbook-air.png'
    },
    { 
      name: 'iPad Pro', 
      category: 'Electronics', 
      price: 799, 
      sold: 287, 
      profit: 28700,
      image: '/images/products/ipad-pro.png'
    },
    { 
      name: 'Apple Watch', 
      category: 'Wearables', 
      price: 399, 
      sold: 198, 
      profit: 8910,
      image: '/images/products/apple-watch.png'
    },
    { 
      name: 'AirPods Pro', 
      category: 'Audio', 
      price: 249, 
      sold: 165, 
      profit: 4125,
      image: '/images/products/airpods-pro.png'
    },
  ];
}

async function getInvoiceTableData() {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    { name: 'Premium Package', price: 299, date: '2024-01-15', status: 'Paid' as const },
    { name: 'Basic Package', price: 99, date: '2024-01-14', status: 'Pending' as const },
    { name: 'Enterprise Package', price: 599, date: '2024-01-13', status: 'Paid' as const },
    { name: 'Starter Package', price: 49, date: '2024-01-12', status: 'Unpaid' as const },
    { name: 'Professional Package', price: 199, date: '2024-01-11', status: 'Paid' as const },
  ];
}

const TablesPage = async () => {
  // Fetch data in parallel
  const [channelsData, productsData, invoiceData] = await Promise.all([
    getTopChannelsData(),
    getTopProductsData(),
    getInvoiceTableData()
  ]);

  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="space-y-10">
        <Suspense fallback={<TopChannelsSkeleton />}>
          <TopChannels data={channelsData} />
        </Suspense>
        
        <Suspense fallback={<TopProductsSkeleton />}>
          <TopProducts data={productsData} />
        </Suspense>

        <InvoiceTable data={invoiceData} />
      </div>
    </>
  );
};

export default TablesPage;