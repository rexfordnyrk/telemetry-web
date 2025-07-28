# eCommerce Components Page Documentation

This page demonstrates all eCommerce-related widget components available in the system. Each component accepts optional data props with default fallbacks.

## Page Route
`/widgets/ecommerce-components`

## Components Used (in order of appearance)

### 1. Congratulations Card
**Component:** `CongratulationsCard`
**Location:** `src/components/ecommerce/CongratulationsCard.tsx`

```typescript
interface CongratulationsData {
  userName: string;
  message: string;
  amount: string;
  targetPercentage: string;
  buttonText: string;
  partyImage: string;
  giftImage: string;
}

// Default Data
const defaultData = {
  userName: "Jhon",
  message: "You are the best seller of this month",
  amount: "$168.5K",
  targetPercentage: "58% of sales target",
  buttonText: "View Details",
  partyImage: "/assets/images/apps/party-popper.png",
  giftImage: "/assets/images/apps/gift-box-3.png"
}
```

### 2. Total Orders (Stat Card)
**Component:** `EcommerceStatCard`
**Location:** `src/components/ecommerce/EcommerceStatCard.tsx`

```typescript
interface EcommerceStatData {
  title: string;
  value: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  icon: string;
  iconBgClass: string;
  chartId: string;
  chartType: "area" | "bar";
  chartData: number[];
  colors: string[];
  gradientColors: string[];
}

// Data for Total Orders
const totalOrdersData = {
  title: "Total Orders",
  value: "248k",
  changePercentage: "+24%",
  changeDirection: "up",
  icon: "shopping_cart",
  iconBgClass: "bg-primary bg-opacity-10 text-primary",
  chartId: "ecommerce-stat-1",
  chartType: "area",
  chartData: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21],
  colors: ["#0d6efd"],
  gradientColors: ["#0d6efd"]
}
```

### 3. Total Sales (Stat Card)
**Component:** `EcommerceStatCard`

```typescript
// Data for Total Sales
const totalSalesData = {
  title: "Total Sales",
  value: "$47.6k",
  changePercentage: "+14%",
  changeDirection: "up",
  icon: "attach_money",
  iconBgClass: "bg-success bg-opacity-10 text-success",
  chartId: "ecommerce-stat-2",
  chartType: "area",
  chartData: [12, 14, 7, 47, 32, 44, 14, 55, 41, 69],
  colors: ["#98ec2d"],
  gradientColors: ["#17ad37"]
}
```

### 4. Total Visits (Stat Card)
**Component:** `EcommerceStatCard`

```typescript
// Data for Total Visits
const totalVisitsData = {
  title: "Total Visits",
  value: "189K",
  changePercentage: "-35%",
  changeDirection: "down",
  icon: "visibility",
  iconBgClass: "bg-info bg-opacity-10 text-info",
  chartId: "ecommerce-stat-3",
  chartType: "area",
  chartData: [47, 45, 74, 32, 56, 31, 44, 33, 45, 19],
  colors: ["#009efd"],
  gradientColors: ["#2af598"]
}
```

### 5. Bounce Rate (Stat Card)
**Component:** `EcommerceStatCard`

```typescript
// Data for Bounce Rate
const bounceRateData = {
  title: "Bounce Rate",
  value: "24.6%",
  changePercentage: "+18%",
  changeDirection: "up",
  icon: "leaderboard",
  iconBgClass: "bg-warning bg-opacity-10 text-warning",
  chartId: "ecommerce-stat-4",
  chartType: "bar",
  chartData: [35, 65, 47, 35, 44, 32, 27, 54, 44, 61],
  colors: ["#ffc107"],
  gradientColors: ["#fe6225"]
}
```

### 6. Order Status
**Component:** `OrderStatusWidget`
**Location:** `src/components/ecommerce/OrderStatusWidget.tsx`

```typescript
interface OrderStatusData {
  title: string;
  centerValue: string;
  centerLabel: string;
  series: number[];
  colors: string[];
  gradientColors: string[];
  statusItems: {
    label: string;
    percentage: string;
    iconColor: string;
  }[];
  chartId: string;
}

// Default Data
const defaultData = {
  title: "Order Status",
  centerValue: "68%",
  centerLabel: "Total Sales",
  series: [58, 25, 25],
  colors: ["#ff6a00", "#98ec2d", "#3494e6"],
  gradientColors: ["#ee0979", "#17ad37", "#ec6ead"],
  statusItems: [
    { label: "Sales", percentage: "68%", iconColor: "text-primary" },
    { label: "Product", percentage: "25%", iconColor: "text-danger" },
    { label: "Income", percentage: "14%", iconColor: "text-success" }
  ],
  chartId: "order-status-chart"
}
```

### 7. Sales & Views
**Component:** `SalesViewsWidget`
**Location:** `src/components/ecommerce/SalesViewsWidget.tsx`

```typescript
interface PeityData {
  value: string;
  color: string;
  label: string;
  amount: string;
  percentage: string;
  amountUnit: string;
}

interface SalesViewsData {
  title: string;
  series: { name: string; data: number[]; }[];
  categories: string[];
  colors: string[];
  gradientColors: string[];
  chartId: string;
  peityData: PeityData[];
}

// Default Data
const defaultData = {
  title: "Sales & Views",
  series: [
    { name: "Sales", data: [20, 5, 60, 10, 30, 20, 25, 15, 31] },
    { name: "Views", data: [17, 10, 45, 15, 25, 15, 40, 10, 24] }
  ],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#ff6a00", "#005bea"],
  gradientColors: ["#ffd200", "#00c6fb"],
  chartId: "sales-views-chart",
  peityData: [
    {
      value: "5/7", color: "#2196f3", label: "Monthly",
      amount: "65,127", percentage: "16.5%", amountUnit: "55.21 USD"
    },
    {
      value: "5/7", color: "#ffd200", label: "Yearly",
      amount: "984,246", percentage: "24.9%", amountUnit: "267.35 USD"
    }
  ]
}
```

### 8. Social Revenue
**Component:** `SocialRevenueWidget`
**Location:** `src/components/ecommerce/SocialRevenueWidget.tsx`

```typescript
interface SocialPlatform {
  name: string;
  category: string;
  icon: string;
  revenue: string;
  change: string;
  changeDirection: "up" | "down";
}

interface SocialRevenueData {
  title: string;
  totalRevenue: string;
  totalChange: string;
  totalChangeDirection: "up" | "down";
  subtitle: string;
  platforms: SocialPlatform[];
}

// Default Data
const defaultData = {
  title: "Social Revenue",
  totalRevenue: "48,569",
  totalChange: "27%",
  totalChangeDirection: "up",
  subtitle: "Last 1 Year Income",
  platforms: [
    {
      name: "Facebook", category: "Social Media",
      icon: "/assets/images/apps/17.png",
      revenue: "45,689", change: "+28.5%", changeDirection: "up"
    },
    {
      name: "Twitter", category: "Social Media",
      icon: "/assets/images/apps/twitter-circle.png",
      revenue: "34,248", change: "-14.5%", changeDirection: "down"
    },
    {
      name: "Tik Tok", category: "Entertainment",
      icon: "/assets/images/apps/03.png",
      revenue: "45,689", change: "+28.5%", changeDirection: "up"
    },
    {
      name: "Instagram", category: "Social Media",
      icon: "/assets/images/apps/19.png",
      revenue: "67,249", change: "-43.5%", changeDirection: "down"
    },
    {
      name: "Snapchat", category: "Conversation",
      icon: "/assets/images/apps/20.png",
      revenue: "89,178", change: "+24.7%", changeDirection: "up"
    }
  ]
}
```

### 9. Popular Products
**Component:** `PopularProductsWidget`
**Location:** `src/components/ecommerce/PopularProductsWidget.tsx`

```typescript
interface Product {
  name: string;
  sales: string;
  price: string;
  change: string;
  changeDirection: "up" | "down";
  image: string;
}

interface PopularProductsData {
  title: string;
  products: Product[];
}

// Default Data
const defaultData = {
  title: "Popular Products",
  products: [
    {
      name: "Apple Hand Watch", sales: "Sale: 258", price: "$199",
      change: "+12%", changeDirection: "up",
      image: "/assets/images/top-products/01.png"
    },
    {
      name: "Mobile Phone Set", sales: "Sale: 169", price: "$159",
      change: "+14%", changeDirection: "up",
      image: "/assets/images/top-products/02.png"
    },
    {
      name: "Grey Shoes Pair", sales: "Sale: 859", price: "$279",
      change: "-12%", changeDirection: "down",
      image: "/assets/images/top-products/04.png"
    },
    {
      name: "Blue Yoga Mat", sales: "Sale: 328", price: "$389",
      change: "+25%", changeDirection: "up",
      image: "/assets/images/top-products/05.png"
    },
    {
      name: "White water Bottle", sales: "Sale: 992", price: "$584",
      change: "-25%", changeDirection: "down",
      image: "/assets/images/top-products/06.png"
    }
  ]
}
```

### 10. Top Vendors
**Component:** `TopVendorsWidget`
**Location:** `src/components/ecommerce/TopVendorsWidget.tsx`

```typescript
interface Vendor {
  name: string;
  sales: string;
  avatar: string;
  rating: number;
}

interface TopVendorsData {
  title: string;
  vendors: Vendor[];
}

// Default Data
const defaultData = {
  title: "Top Vendors",
  vendors: [
    {
      name: "Ajay Sidhu", sales: "Sale: 879",
      avatar: "/assets/images/avatars/01.png", rating: 5
    },
    {
      name: "Ajay Sidhu", sales: "Sale: 879",
      avatar: "/assets/images/avatars/02.png", rating: 4
    },
    {
      name: "Ajay Sidhu", sales: "Sale: 879",
      avatar: "/assets/images/avatars/03.png", rating: 3
    },
    {
      name: "Ajay Sidhu", sales: "Sale: 879",
      avatar: "/assets/images/avatars/04.png", rating: 2
    },
    {
      name: "Ajay Sidhu", sales: "Sale: 879",
      avatar: "/assets/images/avatars/08.png", rating: 1
    }
  ]
}
```

### 11. Transactions
**Component:** `TransactionsWidget`
**Location:** `src/components/ecommerce/TransactionsWidget.tsx`

```typescript
interface Transaction {
  date: string;
  time: string;
  sourceName: string;
  plan: string;
  sourceIcon: string;
  status: string;
  statusClass: string;
  amount: string;
}

interface TransactionsData {
  title: string;
  transactions: Transaction[];
}

// Default Data
const defaultData = {
  title: "Transactions",
  transactions: [
    {
      date: "10 Sep,2024", time: "8:20 PM",
      sourceName: "Paypal", plan: "Business Plan",
      sourceIcon: "/assets/images/apps/paypal.png",
      status: "Paid", statusClass: "bg-success text-success",
      amount: "$5897"
    },
    {
      date: "10 Sep,2024", time: "8:20 PM",
      sourceName: "Visa", plan: "Business Plan",
      sourceIcon: "/assets/images/apps/13.png",
      status: "Unpaid", statusClass: "bg-danger text-danger",
      amount: "$9638"
    }
    // ... more transactions
  ]
}
```

### 12. Messages
**Component:** `MessagesProgressCard`
**Location:** `src/components/ecommerce/MessagesProgressCard.tsx`

```typescript
interface MessagesProgressData {
  title: string;
  value: string;
  icon: string;
  iconBgClass: string;
  progress: number;
  progressBgClass: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  subtitle: string;
}

// Default Data
const defaultData = {
  title: "Messages",
  value: "986",
  icon: "shopping_cart",
  iconBgClass: "bg-grd-danger",
  progress: 60,
  progressBgClass: "bg-grd-danger",
  changePercentage: "+34.7%",
  changeDirection: "up",
  subtitle: "from last month"
}
```

### 13. Total Profit
**Component:** `TotalProfitWidget`
**Location:** `src/components/ecommerce/TotalProfitWidget.tsx`

```typescript
interface TotalProfitData {
  title: string;
  value: string;
  subtitle: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  chartId: string;
  chartData: number[];
  colors: string[];
  gradientColors: string[];
}

// Default Data
const defaultData = {
  title: "Total Profit",
  value: "$15.7K",
  subtitle: "from last month",
  changePercentage: "12.5%",
  changeDirection: "up",
  chartId: "total-profit-chart",
  chartData: [8, 10, 25, 18, 38, 24, 20, 16, 7],
  colors: ["#ff0080"],
  gradientColors: ["#7928ca"]
}
```

### 14. Monthly Budget
**Component:** `MonthlyBudgetWidget`
**Location:** `src/components/ecommerce/MonthlyBudgetWidget.tsx`

```typescript
interface MonthlyBudgetData {
  title: string;
  amount: string;
  description: string;
  buttonText: string;
  percentage: number;
  chartId: string;
  colors: string[];
  gradientColors: string[];
}

// Default Data
const defaultData = {
  title: "Monthly Budget",
  amount: "$84,256",
  description: "Vestibulum fermentum nisl id nulla ultricies convallis.",
  buttonText: "Increase Budget",
  percentage: 78,
  chartId: "monthly-budget-chart",
  colors: ["#98ec2d"],
  gradientColors: ["#005bea"]
}
```

## Usage Notes

- All components support both **default constructor** (no props) and **data constructor** (with custom data)
- Chart IDs must be unique across the page to avoid conflicts
- Icon classes use Material Icons outlined style
- Color arrays support single or multiple colors for gradients
- File paths for images should be relative to the public directory
