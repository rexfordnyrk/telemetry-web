# Data Components Page Documentation

This page demonstrates all basic data widget components available in the system. These are fundamental chart and stat widgets that can be reused across different pages.

## Page Route
`/widgets/data-components`

## Components Used (in order of appearance)

### Row 1 - Area Charts

### 1. Total Sales (Area Chart)
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

// Data for Total Sales
const totalSalesData = {
  title: "Total Sales",
  value: "$9,568",
  changePercentage: "8.6%",
  changeDirection: "down",
  chartId: "chart1"
  // Uses default data: [4, 10, 25, 12, 25, 18, 40, 22, 7]
  // Uses default colors: ["#02c27a"], gradientColors: ["#0866ff"]
}
```

### 2. Total Accounts (Area Chart)
**Component:** `AreaChartWidget`

```typescript
// Data for Total Accounts
const totalAccountsData = {
  title: "Total Accounts",
  value: "85,247",
  changePercentage: "23.7%",
  changeDirection: "up",
  chartId: "chart2",
  colors: ["#ffc107"],
  gradientColors: ["#fc185a"]
}
```

### 3. Average Weekly Sales (Area Chart)
**Component:** `AreaChartWidget`

```typescript
// Data for Average Weekly Sales
const weeklySalesData = {
  title: "Average Weekly Sales",
  value: "$69,452",
  changePercentage: "8.6%",
  changeDirection: "down",
  chartId: "chart3",
  colors: ["#0dcaf0"],
  gradientColors: ["#0dcaf0"]
}
```

### Row 1 - Progress Widgets

### 4. Sale This Year (Progress Widget)
**Component:** `ProgressWidget`
**Location:** `src/components/widgets/ProgressWidget.tsx`

```typescript
interface ProgressWidgetProps {
  title: string;
  value: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  progressLabel: string;
  progressPercentage: number;
  progressBarClass: string;
}

// Data for Sale This Year
const saleThisYearData = {
  title: "Sale This Year",
  value: "$65,129",
  changePercentage: "24.7%",
  changeDirection: "up",
  progressLabel: "left to Goal",
  progressPercentage: 68,
  progressBarClass: "bg-grd-purple"
}
```

### 5. Sale This Month (Progress Widget)
**Component:** `ProgressWidget`

```typescript
// Data for Sale This Month
const saleThisMonthData = {
  title: "Sale This Month",
  value: "$88,367",
  changePercentage: "18.6%",
  changeDirection: "up",
  progressLabel: "left to Goal",
  progressPercentage: 78,
  progressBarClass: "bg-grd-danger"
}
```

### 6. Sale This Week (Progress Widget)
**Component:** `ProgressWidget`

```typescript
// Data for Sale This Week
const saleThisWeekData = {
  title: "Sale This Week",
  value: "$55,674",
  changePercentage: "42.6%",
  changeDirection: "up",
  progressLabel: "left to Goal",
  progressPercentage: 88,
  progressBarClass: "bg-grd-success"
}
```

### Row 2 - Mixed Chart Types

### 7. Total Users (Bar Chart)
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

// Data for Total Users (Bar Chart)
const totalUsersBarData = {
  title: "Total Users",
  value: "97.4K",
  subtitle: "12.5% from last month",
  chartId: "chart4"
  // Uses default data and colors
}
```

### 8. Active Users (Radial Chart)
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

// Data for Active Users (Radial Chart)
const activeUsersRadialData = {
  title: "Active Users",
  value: "42.5K",
  subtitle: "24K users increased from last month",
  chartId: "chart5"
  // Uses default series: [78], colors: ["#ee0979"], gradientColors: ["#ffd200"]
}
```

### 9. Total Users (Bar Chart - Custom Colors)
**Component:** `BarChartWidget`

```typescript
// Data for Total Users (Custom Colors)
const totalUsersCustomData = {
  title: "Total Users",
  value: "97.4K",
  subtitle: "12.5% from last month",
  chartId: "chart6",
  data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
  colors: ["#02c27a"],
  gradientColors: ["#17ad37"]
}
```

### 10. Active Users (Bar Chart - Purple)
**Component:** `BarChartWidget`

```typescript
// Data for Active Users (Purple Bar Chart)
const activeUsersBarData = {
  title: "Active Users",
  value: "42.5K",
  subtitle: "24K users increased from last month",
  chartId: "chart7",
  data: [4, 10, 12, 17, 25, 30, 40, 55, 68],
  colors: ["#ff0080"],
  gradientColors: ["#7928ca"]
}
```

### 11. Total Users (Radial Chart - Custom)
**Component:** `RadialChartWidget`

```typescript
// Data for Total Users (Custom Radial Chart)
const totalUsersRadialData = {
  title: "Total Users",
  value: "97.4K",
  subtitle: "12.5% from last month",
  chartId: "chart8",
  colors: ["#98ec2d"],
  gradientColors: ["#005bea"],
  height: 165,
  startAngle: 0,
  endAngle: 360
}
```

### 12. Active Users (Line Chart)
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

// Data for Active Users (Line Chart)
const activeUsersLineData = {
  title: "Active Users",
  value: "42.5K",
  subtitle: "24K users increased from last month",
  chartId: "chart9"
  // Uses default data: [4, 25, 14, 34, 10, 39]
  // Uses default colors: ["#ee0979"], gradientColors: ["#00f2fe"]
}
```

### Row 3 - Advanced Charts

### 13. Order Status (Donut Chart)
**Component:** `DonutChartWidget`
**Location:** `src/components/widgets/DonutChartWidget.tsx`

```typescript
interface DonutChartWidgetProps {
  title: string;
  centerLabel: string;
  centerValue: string;
  chartId: string;
  series?: number[];
  labels?: string[];
  colors?: string[];
  gradientColors?: string[];
  showDropdown?: boolean;
}

// Data for Order Status
const orderStatusData = {
  title: "Order Status",
  centerLabel: "Total Sales",
  centerValue: "68%",
  chartId: "chart11"
  // Uses default series: [58, 25, 25]
  // Uses default colors: ["#ff6a00", "#98ec2d", "#3494e6"]
  // Uses default gradientColors: ["#ee0979", "#17ad37", "#ec6ead"]
}
```

### 14. Sales & Views (Multi-Series Bar Chart)
**Component:** `MultiSeriesBarChart`
**Location:** `src/components/widgets/MultiSeriesBarChart.tsx`

```typescript
interface MultiSeriesBarChartProps {
  title: string;
  chartId: string;
  series?: { name: string; data: number[]; }[];
  categories?: string[];
  colors?: string[];
  gradientColors?: string[];
  showDropdown?: boolean;
}

// Data for Sales & Views
const salesViewsData = {
  title: "Sales & Views",
  chartId: "chart10"
  // Uses default series with Sales and Views data
  // Uses default colors and categories
}
```

### Row 4 - Stat Cards

### 15. Monthly Revenue (Stat Card)
**Component:** `StatCardWidget`
**Location:** `src/components/widgets/StatCardWidget.tsx`

```typescript
interface StatCardWidgetProps {
  title: string;
  value: string;
  subtitle: string;
  chartId: string;
  chartType?: "area" | "bar";
  data?: number[];
  backgroundColor?: string;
  textColor?: string;
  colors?: string[];
  gradientColors?: string[];
  height?: number;
  showDropdown?: boolean;
}

// Data for Monthly Revenue
const monthlyRevenueStatData = {
  title: "Monthly Revenue",
  value: "68.9%",
  subtitle: "Average monthly sale for every author",
  chartId: "chart12"
  // Uses default chart type, data, and colors
}
```

### 16. Trending Products (Stat Card - Purple)
**Component:** `StatCardWidget`

```typescript
// Data for Trending Products
const trendingProductsData = {
  title: "Trending Products",
  value: "48.2%",
  subtitle: "Average monthly sale for every author",
  chartId: "chart13",
  chartType: "bar",
  data: [44, 55, 41],
  backgroundColor: "bg-grd-purple",
  textColor: "text-white",
  colors: ["#ee0979"],
  gradientColors: ["#005bea"],
  height: 237
}
```

### 17. Yearly Income (Stat Card - Area)
**Component:** `StatCardWidget`

```typescript
// Data for Yearly Income
const yearlyIncomeData = {
  title: "Yearly Income",
  value: "68.9%",
  subtitle: "Average monthly sale for every author",
  chartId: "chart14",
  chartType: "area",
  data: [100, 65, 34, 51, 25, 40, 21, 35, 15],
  colors: ["#98ec2d"],
  gradientColors: ["#17ad37"],
  height: 250
}
```

## Default Values by Component

### AreaChartWidget Defaults
```typescript
const defaultProps = {
  data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#02c27a"],
  gradientColors: ["#0866ff"]
}
```

### RadialChartWidget Defaults
```typescript
const defaultProps = {
  series: [78],
  colors: ["#ee0979"],
  gradientColors: ["#ffd200"],
  height: 180,
  showDropdown: true,
  startAngle: -115,
  endAngle: 115
}
```

### BarChartWidget Defaults
```typescript
const defaultProps = {
  data: [8, 10, 25, 18, 38, 24, 20, 16, 7],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#98ec2d"],
  gradientColors: ["#17ad37"],
  height: 120,
  showDropdown: true
}
```

### LineChartWidget Defaults
```typescript
const defaultProps = {
  data: [4, 25, 14, 34, 10, 39],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  colors: ["#ee0979"],
  gradientColors: ["#00f2fe"],
  height: 105,
  showDropdown: true
}
```

## Usage Notes

- All components support both **default constructor** (no props) and **data constructor** (with custom data)
- Chart IDs must be unique across the page to avoid conflicts
- Progress percentages are values from 0-100
- Radial chart angles are in degrees (-180 to 360)
- Color arrays can contain single or multiple colors for gradients
- Background classes support Bootstrap gradient classes (bg-grd-*)
- Height values are in pixels
- All chart components include optional dropdown menus
