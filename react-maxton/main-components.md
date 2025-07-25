# Main Components Page Documentation

This page demonstrates all main dashboard widget components available in the system. Each component accepts optional data props with default fallbacks.

## Page Route
`/widgets/main-components`

## Components Used (in order of appearance)

### 1. Welcome Card
**Component:** `WelcomeCard`
**Location:** `src/components/dashboard/WelcomeCard.tsx`

```typescript
interface WelcomeData {
  userName: string;
  userAvatar: string;
  todaysSales: string;
  growthRate: string;
  salesProgress: number;
  growthProgress: number;
  welcomeImage: string;
}

// Default Data
const defaultData = {
  userName: "Jhon Anderson",
  userAvatar: "/assets/images/avatars/01.png",
  todaysSales: "$65.4K",
  growthRate: "78.4%",
  salesProgress: 60,
  growthProgress: 60,
  welcomeImage: "/assets/images/gallery/welcome-back-3.png"
}
```

### 2. Active Users
**Component:** `RadialChartWidget`
**Location:** `src/components/widgets/RadialChartWidget.tsx`

```typescript
interface RadialChartWidgetProps {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  series?: number[];
  colors?: string[];
  gradientColors?: string[];
  height?: number;
  showDropdown?: boolean;
  startAngle?: number;
  endAngle?: number;
}

// Data for Active Users
const activeUsersData = {
  title: "Active Users",
  value: "42.5K",
  subtitle: "24K users increased from last month",
  chartId: "radial-chart-1",
  series: [78],
  colors: ["#ee0979"],
  gradientColors: ["#ffd200"]
}
```

### 3. Total Users
**Component:** `AreaChartWidget`
**Location:** `src/components/widgets/AreaChartWidget.tsx`

```typescript
interface AreaChartWidgetProps {
  title: string;
  value: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  chartId: string;
  subtitle?: string;
  data?: number[];
  categories?: string[];
  colors?: string[];
  gradientColors?: string[];
}

// Data for Total Users
const totalUsersData = {
  title: "Total Users",
  value: "97.4K",
  changePercentage: "12.5%",
  changeDirection: "up",
  chartId: "area-chart-1",
  subtitle: "from last month",
  data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
  colors: ["#02c27a"],
  gradientColors: ["#0866ff"]
}
```

### 4. Monthly Revenue
**Component:** `MonthlyRevenueWidget`
**Location:** `src/components/dashboard/MonthlyRevenueWidget.tsx`

```typescript
interface MonthlyRevenueData {
  title: string;
  subtitle: string;
  percentageValue: string;
  percentageChange: string;
  percentageDirection: "up" | "down";
  series: { name: string; data: number[]; }[];
  categories: string[];
  colors: string[];
  gradientColors: string[];
}

// Default Data
const defaultData = {
  title: "Monthly Revenue",
  subtitle: "Average monthly sale for every author",
  percentageValue: "68.9%",
  percentageChange: "34.5%",
  percentageDirection: "up",
  series: [{ name: "Revenue", data: [14, 41, 35, 51, 25, 18, 21, 35, 15] }],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#2af598"],
  gradientColors: ["#009efd"]
}
```

### 5. Device Type
**Component:** `DeviceTypeWidget`
**Location:** `src/components/dashboard/DeviceTypeWidget.tsx`

```typescript
interface DeviceTypeData {
  title: string;
  centerTitle: string;
  centerValue: string;
  series: number[];
  labels: string[];
  colors: string[];
  gradientColors: string[];
  devices: {
    name: string;
    icon: string;
    percentage: string;
    iconColor: string;
  }[];
}

// Default Data
const defaultData = {
  title: "Device Type",
  centerTitle: "Total Views",
  centerValue: "68%",
  series: [58, 25, 25],
  labels: ["Desktop", "Tablet", "Mobile"],
  colors: ["#ff6a00", "#98ec2d", "#3494e6"],
  gradientColors: ["#ee0979", "#17ad37", "#ec6ead"],
  devices: [
    { name: "Desktop", icon: "desktop_windows", percentage: "35%", iconColor: "text-primary" },
    { name: "Tablet", icon: "tablet_mac", percentage: "48%", iconColor: "text-danger" },
    { name: "Mobile", icon: "phone_android", percentage: "27%", iconColor: "text-success" }
  ]
}
```

### 6. Total Clicks
**Component:** `BarChartWidget`
**Location:** `src/components/widgets/BarChartWidget.tsx`

```typescript
interface BarChartWidgetProps {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  data?: number[];
  categories?: string[];
  colors?: string[];
  gradientColors?: string[];
  height?: number;
  showDropdown?: boolean;
}

// Data for Total Clicks
const totalClicksData = {
  title: "Total Clicks",
  value: "82.7K",
  subtitle: "12.5% from last month",
  chartId: "bar-chart-1",
  data: [4, 10, 12, 17, 25, 30, 40, 55, 68],
  colors: ["#ff6a00"],
  gradientColors: ["#7928ca"]
}
```

### 7. Total Views
**Component:** `LineChartWidget`
**Location:** `src/components/widgets/LineChartWidget.tsx`

```typescript
interface LineChartWidgetProps {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  data?: number[];
  categories?: string[];
  colors?: string[];
  gradientColors?: string[];
  height?: number;
  showDropdown?: boolean;
}

// Data for Total Views
const totalViewsData = {
  title: "Total Views",
  value: "68.4K",
  subtitle: "35K users increased from last month",
  chartId: "line-chart-1",
  data: [4, 25, 14, 34, 10, 39],
  colors: ["#ee0979"],
  gradientColors: ["#00f2fe"]
}
```

### 8. Total Accounts
**Component:** `StatCard`
**Location:** `src/components/dashboard/StatCard.tsx`

```typescript
interface StatCardData {
  title: string;
  value: string;
  subtitle: string;
  changePercentage?: string;
  changeDirection?: "up" | "down";
  chartComponent?: React.ReactNode;
  showDropdown?: boolean;
}

// Data for Total Accounts
const totalAccountsData = {
  title: "Total Accounts",
  value: "85,247",
  subtitle: "accounts registered",
  changePercentage: "23.7%",
  changeDirection: "down",
  chartComponent: (
    <SafeApexChart
      options={{
        series: [{ name: "Total Accounts", data: [4, 10, 25, 12, 25, 18, 40, 22, 7] }],
        chart: { height: 105, type: "area", sparkline: { enabled: true }, zoom: { enabled: false } },
        dataLabels: { enabled: false },
        stroke: { width: 3, curve: "smooth" },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark", gradientToColors: ["#fc185a"], shadeIntensity: 1,
            type: "vertical", opacityFrom: 0.8, opacityTo: 0.2
          }
        },
        colors: ["#ffc107"],
        tooltip: { theme: "dark", fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: function () { return ""; } } }, marker: { show: false } },
        xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"] }
      }}
      series={[{ name: "Total Accounts", data: [4, 10, 25, 12, 25, 18, 40, 22, 7] }]}
      type="area"
      height={105}
    />
  )
}
```

### 9. Campaign Stats
**Component:** `CampaignStatsWidget`
**Location:** `src/components/dashboard/CampaignStatsWidget.tsx`

```typescript
interface CampaignStat {
  title: string;
  value: string;
  percentage: string;
  icon: string;
  bgClass: string;
  textClass: string;
}

interface CampaignStatsData {
  title: string;
  stats: CampaignStat[];
}

// Default Data
const defaultData = {
  title: "Campaign Stats",
  stats: [
    { title: "Campaigns", value: "54", percentage: "28%", icon: "calendar_today", bgClass: "bg-grd-primary", textClass: "text-success" },
    { title: "Emailed", value: "245", percentage: "15%", icon: "email", bgClass: "bg-grd-success", textClass: "text-danger" },
    { title: "Opened", value: "54", percentage: "30.5%", icon: "open_in_new", bgClass: "bg-grd-branding", textClass: "text-success" },
    { title: "Clicked", value: "859", percentage: "34.6%", icon: "ads_click", bgClass: "bg-grd-warning", textClass: "text-danger" },
    { title: "Subscribed", value: "24,758", percentage: "53%", icon: "subscriptions", bgClass: "bg-grd-info", textClass: "text-success" },
    { title: "Spam Message", value: "548", percentage: "47%", icon: "inbox", bgClass: "bg-grd-danger", textClass: "text-danger" },
    { title: "Views Mails", value: "9845", percentage: "68%", icon: "visibility", bgClass: "bg-grd-deep-blue", textClass: "text-success" }
  ]
}
```

### 10. Visitors Growth
**Component:** `VisitorsGrowthWidget`
**Location:** `src/components/dashboard/VisitorsGrowthWidget.tsx`

```typescript
interface ProgressItem {
  label: string;
  value: string;
  progress: number;
  bgClass: string;
}

interface VisitorsGrowthData {
  title: string;
  mainPercentage: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  series: { name: string; data: number[]; }[];
  categories: string[];
  colors: string[];
  gradientColors: string[];
  progressItems: ProgressItem[];
}

// Default Data
const defaultData = {
  title: "Visitors Growth",
  mainPercentage: "36.7%",
  changePercentage: "34.5%",
  changeDirection: "up",
  series: [{ name: "Total Sales", data: [4, 10, 25, 12, 25, 18, 40, 22, 7] }],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#98ec2d"],
  gradientColors: ["#17ad37"],
  progressItems: [
    { label: "Clicks", value: "2589", progress: 65, bgClass: "bg-grd-primary" },
    { label: "Likes", value: "6748", progress: 55, bgClass: "bg-grd-warning" },
    { label: "Upvotes", value: "9842", progress: 45, bgClass: "bg-grd-info" }
  ]
}
```

### 11. Social Leads
**Component:** `SocialLeadsWidget`
**Location:** `src/components/dashboard/SocialLeadsWidget.tsx`

```typescript
interface SocialLead {
  name: string;
  icon: string;
  percentage: string;
  data: string;
  color: string;
}

interface SocialLeadsData {
  title: string;
  leads: SocialLead[];
}

// Default Data
const defaultData = {
  title: "Social Leads",
  leads: [
    { name: "Facebook", icon: "/assets/images/apps/17.png", percentage: "55%", data: "5/7", color: "#0d6efd" },
    { name: "LinkedIn", icon: "/assets/images/apps/18.png", percentage: "67%", data: "5/7", color: "#fc185a" },
    { name: "Instagram", icon: "/assets/images/apps/19.png", percentage: "78%", data: "5/7", color: "#02c27a" },
    { name: "Snapchat", icon: "/assets/images/apps/20.png", percentage: "46%", data: "5/7", color: "#fd7e14" },
    { name: "Google", icon: "/assets/images/apps/05.png", percentage: "38%", data: "5/7", color: "#0dcaf0" },
    { name: "Altaba", icon: "/assets/images/apps/08.png", percentage: "15%", data: "5/7", color: "#6f42c1" },
    { name: "Spotify", icon: "/assets/images/apps/07.png", percentage: "12%", data: "5/7", color: "#ff00b3" }
  ]
}
```

### 12. New Users
**Component:** `NewUsersWidget`
**Location:** `src/components/dashboard/NewUsersWidget.tsx`

```typescript
interface NewUser {
  name: string;
  username: string;
  avatar: string;
}

interface NewUsersData {
  title: string;
  users: NewUser[];
}

// Default Data
const defaultData = {
  title: "New Users",
  users: [
    { name: "Elon Jonado", username: "elon_deo", avatar: "/assets/images/avatars/01.png" },
    { name: "Alexzender Clito", username: "zli_alexzender", avatar: "/assets/images/avatars/02.png" },
    { name: "Michle Tinko", username: "tinko_michle", avatar: "/assets/images/avatars/03.png" },
    { name: "KailWemba", username: "wemba_kl", avatar: "/assets/images/avatars/04.png" },
    { name: "Henhco Tino", username: "Henhco_tino", avatar: "/assets/images/avatars/05.png" },
    { name: "Gonjiko Fernando", username: "gonjiko_fernando", avatar: "/assets/images/avatars/06.png" },
    { name: "Specer Kilo", username: "specer_kilo", avatar: "/assets/images/avatars/08.png" }
  ]
}
```

### 13. Recent Orders
**Component:** `RecentOrdersWidget`
**Location:** `src/components/dashboard/RecentOrdersWidget.tsx`

```typescript
interface RecentOrder {
  id: number;
  product: string;
  image: string;
  amount: string;
  vendor: string;
  status: string;
  statusClass: string;
  rating: number;
}

interface RecentOrdersData {
  title: string;
  orders: RecentOrder[];
}

// Default Data
const defaultData = {
  title: "Recent Orders",
  orders: [
    {
      id: 1, product: "Sports Shoes", image: "/assets/images/top-products/01.png",
      amount: "$149", vendor: "Julia Sunota", status: "Completed",
      statusClass: "bg-success", rating: 5.0
    },
    {
      id: 2, product: "Golden Watch", image: "/assets/images/top-products/02.png",
      amount: "$168", vendor: "Julia Sunota", status: "Completed",
      statusClass: "bg-success", rating: 5.0
    },
    {
      id: 3, product: "Men Polo Tshirt", image: "/assets/images/top-products/03.png",
      amount: "$124", vendor: "Julia Sunota", status: "Pending",
      statusClass: "bg-warning", rating: 4.0
    },
    {
      id: 4, product: "Blue Jeans Casual", image: "/assets/images/top-products/04.png",
      amount: "$289", vendor: "Julia Sunota", status: "Completed",
      statusClass: "bg-success", rating: 3.0
    },
    {
      id: 5, product: "Fancy Shirts", image: "/assets/images/top-products/06.png",
      amount: "$389", vendor: "Julia Sunota", status: "Canceled",
      statusClass: "bg-danger", rating: 2.0
    }
  ]
}
```

## Usage Notes

- All components support both **default constructor** (no props) and **data constructor** (with custom data)
- Chart IDs must be unique across the page to avoid conflicts
- Icon classes use Material Icons outlined style
- Color arrays support single or multiple colors for gradients
- File paths for images should be relative to the public directory
- Progress values are percentages (0-100)
- Rating values are numbers (1-5 for star ratings)
