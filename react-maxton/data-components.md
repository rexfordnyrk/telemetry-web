# Data Components Documentation

This document provides comprehensive documentation for all widget components used in the `/widgets/data-components` page, including their required data object structures, props, and usage examples.

## Table of Contents

1. [AreaChartWidget](#areachartwidget)
2. [BarChartWidget](#barchartwidget)
3. [RadialChartWidget](#radialchartwidget)
4. [LineChartWidget](#linechartwidget)
5. [DonutChartWidget](#donutchartwidget)
6. [MultiSeriesBarChart](#multiseriesbarchart)
7. [ProgressWidget](#progresswidget)
8. [StatCardWidget](#statcardwidget)

---

## AreaChartWidget

**Purpose**: Displays area/line charts with gradient fills for trend visualization.

### Interface

```typescript
interface AreaChartWidgetProps {
  title: string;                    // Widget title
  value: string;                    // Primary value to display
  changePercentage: string;         // Percentage change indicator
  changeDirection: "up" | "down";   // Direction of change
  chartId: string;                  // Unique ID for chart container
  data?: number[];                  // Optional chart data points
  categories?: string[];            // Optional x-axis categories
  colors?: string[];               // Optional chart colors
  gradientColors?: string[];       // Optional gradient colors
}
```

### Default Data Structure

```typescript
const defaultProps = {
  data: [4, 10, 25, 12, 25, 18, 40, 22, 7],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#02c27a"],
  gradientColors: ["#0866ff"]
};
```

### Usage Examples

```tsx
// Basic usage with defaults
<AreaChartWidget
  title="Total Sales"
  value="$9,568"
  changePercentage="8.6%"
  changeDirection="down"
  chartId="chart1"
/>

// Custom data usage
<AreaChartWidget
  title="Revenue Growth"
  value="$15,420"
  changePercentage="12.3%"
  changeDirection="up"
  chartId="revenue-chart"
  data={[10, 15, 20, 25, 30, 35, 40, 45, 50]}
  colors={["#ff6b6b"]}
  gradientColors={["#4ecdc4"]}
/>
```

---

## BarChartWidget

**Purpose**: Displays bar charts with customizable data series and styling.

### Interface

```typescript
interface BarChartWidgetProps {
  title: string;                    // Widget title
  value: string;                    // Primary value to display
  subtitle: string;                 // Subtitle text
  chartId: string;                  // Unique ID for chart container
  data?: number[];                  // Optional chart data points
  categories?: string[];            // Optional x-axis categories
  colors?: string[];               // Optional chart colors
  gradientColors?: string[];       // Optional gradient colors
  height?: number;                 // Optional chart height
  showDropdown?: boolean;          // Optional dropdown menu
}
```

### Default Data Structure

```typescript
const defaultProps = {
  data: [8, 10, 25, 18, 38, 24, 20, 16, 7],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#98ec2d"],
  gradientColors: ["#17ad37"],
  height: 120,
  showDropdown: true
};
```

### Usage Examples

```tsx
// Basic usage
<BarChartWidget
  title="Total Users"
  value="97.4K"
  subtitle="12.5% from last month"
  chartId="chart4"
/>

// Custom styling
<BarChartWidget
  title="Active Sessions"
  value="15.2K"
  subtitle="24% increase this week"
  chartId="sessions-chart"
  data={[5, 12, 18, 25, 30, 28, 35, 40, 45]}
  colors={["#ff9500"]}
  gradientColors={["#ff5722"]}
  height={150}
  showDropdown={false}
/>
```

---

## RadialChartWidget

**Purpose**: Displays radial/circular progress charts with percentage indicators.

### Interface

```typescript
interface RadialChartWidgetProps {
  title: string;                    // Widget title
  value: string;                    // Primary value to display
  subtitle: string;                 // Subtitle text
  chartId: string;                  // Unique ID for chart container
  series?: number[];               // Optional progress values (0-100)
  colors?: string[];               // Optional chart colors
  gradientColors?: string[];       // Optional gradient colors
  height?: number;                 // Optional chart height
  showDropdown?: boolean;          // Optional dropdown menu
  startAngle?: number;             // Optional start angle
  endAngle?: number;               // Optional end angle
}
```

### Default Data Structure

```typescript
const defaultProps = {
  series: [78],
  colors: ["#ee0979"],
  gradientColors: ["#ffd200"],
  height: 180,
  showDropdown: true,
  startAngle: -115,
  endAngle: 115
};
```

### Usage Examples

```tsx
// Basic usage
<RadialChartWidget
  title="Active Users"
  value="42.5K"
  subtitle="24K users increased from last month"
  chartId="chart5"
/>

// Full circle progress
<RadialChartWidget
  title="Storage Usage"
  value="85%"
  subtitle="3.2GB remaining"
  chartId="storage-chart"
  series={[85]}
  colors={["#3b82f6"]}
  gradientColors={["#06b6d4"]}
  startAngle={0}
  endAngle={360}
/>
```

---

## LineChartWidget

**Purpose**: Displays line charts with trend visualization.

### Interface

```typescript
interface LineChartWidgetProps {
  title: string;                    // Widget title
  value: string;                    // Primary value to display
  subtitle: string;                 // Subtitle text
  chartId: string;                  // Unique ID for chart container
  data?: number[];                  // Optional chart data points
  categories?: string[];            // Optional x-axis categories
  colors?: string[];               // Optional chart colors
  gradientColors?: string[];       // Optional gradient colors
  height?: number;                 // Optional chart height
  showDropdown?: boolean;          // Optional dropdown menu
}
```

### Default Data Structure

```typescript
const defaultProps = {
  data: [4, 25, 14, 34, 10, 39],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  colors: ["#ee0979"],
  gradientColors: ["#00f2fe"],
  height: 105,
  showDropdown: true
};
```

### Usage Examples

```tsx
// Basic usage
<LineChartWidget
  title="Active Users"
  value="42.5K"
  subtitle="24K users increased from last month"
  chartId="chart9"
/>

// Extended time series
<LineChartWidget
  title="Daily Visitors"
  value="8.7K"
  subtitle="Consistent growth pattern"
  chartId="visitors-chart"
  data={[12, 19, 15, 27, 22, 35, 28, 31, 40, 38, 45, 42]}
  categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
  colors={["#10b981"]}
  gradientColors={["#06d6a0"]}
/>
```

---

## DonutChartWidget

**Purpose**: Displays donut/pie charts with legends and center labels.

### Interface

```typescript
interface LegendItem {
  label: string;                    // Legend label
  value: string;                    // Legend value
  color: string;                    // CSS color class
}

interface DonutChartWidgetProps {
  title: string;                    // Widget title
  centerLabel?: string;             // Optional center label
  centerValue?: string;             // Optional center value
  chartId: string;                  // Unique ID for chart container
  series?: number[];               // Optional data series
  colors?: string[];               // Optional chart colors
  gradientColors?: string[];       // Optional gradient colors
  height?: number;                 // Optional chart height
  showDropdown?: boolean;          // Optional dropdown menu
  legendItems?: LegendItem[];      // Optional legend items
  backgroundColor?: string;         // Optional background class
}
```

### Default Data Structure

```typescript
const defaultProps = {
  series: [58, 25, 25],
  colors: ["#ff6a00", "#98ec2d", "#3494e6"],
  gradientColors: ["#ee0979", "#17ad37", "#ec6ead"],
  height: 290,
  showDropdown: true,
  legendItems: [
    { label: "Sales", value: "68%", color: "text-primary" },
    { label: "Product", value: "25%", color: "text-danger" },
    { label: "Income", value: "14%", color: "text-success" }
  ]
};
```

### Usage Examples

```tsx
// Basic usage
<DonutChartWidget
  title="Order Status"
  centerLabel="Total Sales"
  centerValue="68%"
  chartId="chart11"
/>

// Custom categories
<DonutChartWidget
  title="Traffic Sources"
  centerLabel="Total Traffic"
  centerValue="45.2K"
  chartId="traffic-chart"
  series={[40, 30, 20, 10]}
  colors={["#3b82f6", "#ef4444", "#10b981", "#f59e0b"]}
  legendItems={[
    { label: "Direct", value: "40%", color: "text-primary" },
    { label: "Social", value: "30%", color: "text-danger" },
    { label: "Organic", value: "20%", color: "text-success" },
    { label: "Referral", value: "10%", color: "text-warning" }
  ]}
/>
```

---

## MultiSeriesBarChart

**Purpose**: Displays complex multi-series bar charts with comparative metrics.

### Interface

```typescript
interface Series {
  name: string;                     // Series name
  data: number[];                   // Series data points
}

interface MultiSeriesBarChartProps {
  title: string;                    // Widget title
  chartId: string;                  // Unique ID for chart container
  series?: Series[];               // Optional data series
  categories?: string[];            // Optional x-axis categories
  colors?: string[];               // Optional chart colors
  gradientColors?: string[];       // Optional gradient colors
  height?: number;                 // Optional chart height
  showDropdown?: boolean;          // Optional dropdown menu
  monthlyValue?: string;           // Optional monthly metric
  monthlyChange?: string;          // Optional monthly change
  monthlyAmount?: string;          // Optional monthly amount
  yearlyValue?: string;            // Optional yearly metric
  yearlyChange?: string;           // Optional yearly change
  yearlyAmount?: string;           // Optional yearly amount
}
```

### Default Data Structure

```typescript
const defaultProps = {
  series: [
    {
      name: "Sales",
      data: [20, 5, 60, 10, 30, 20, 25, 15, 31]
    },
    {
      name: "Views",
      data: [17, 10, 45, 15, 25, 15, 40, 10, 24]
    }
  ],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#ff6a00", "#005bea"],
  gradientColors: ["#ffd200", "#00c6fb"],
  height: 235,
  showDropdown: true,
  monthlyValue: "65,127",
  monthlyChange: "16.5%",
  monthlyAmount: "55.21 USD",
  yearlyValue: "984,246",
  yearlyChange: "24.9%",
  yearlyAmount: "267.35 USD"
};
```

### Usage Examples

```tsx
// Basic usage
<MultiSeriesBarChart
  title="Sales & Views"
  chartId="chart10"
/>

// Custom data comparison
<MultiSeriesBarChart
  title="Revenue vs Profit"
  chartId="revenue-profit-chart"
  series={[
    { name: "Revenue", data: [100, 120, 110, 140, 130, 160, 150, 170, 180] },
    { name: "Profit", data: [20, 25, 22, 30, 28, 35, 32, 38, 40] }
  ]}
  colors={["#059669", "#dc2626"]}
  gradientColors={["#10b981", "#ef4444"]}
  monthlyValue="125,430"
  monthlyChange="18.2%"
  monthlyAmount="78.50 USD"
  yearlyValue="1,505,160"
  yearlyChange="22.7%"
  yearlyAmount="942.00 USD"
/>
```

---

## ProgressWidget

**Purpose**: Displays progress bars with metrics and percentages.

### Interface

```typescript
interface ProgressWidgetProps {
  title: string;                    // Widget title
  value: string;                    // Primary value to display
  changePercentage: string;         // Percentage change indicator
  changeDirection: "up" | "down";   // Direction of change
  progressLabel: string;            // Progress description
  progressPercentage: number;       // Progress value (0-100)
  progressBarClass: string;         // CSS class for progress bar
  leftToGoal?: string;             // Optional goal description
}
```

### Default Data Structure

```typescript
const defaultProps = {
  leftToGoal: "285 left to Goal"
};
```

### Usage Examples

```tsx
// Basic usage
<ProgressWidget
  title="Sale This Year"
  value="$65,129"
  changePercentage="24.7%"
  changeDirection="up"
  progressLabel="left to Goal"
  progressPercentage={68}
  progressBarClass="bg-grd-purple"
/>

// Custom goal tracking
<ProgressWidget
  title="Monthly Target"
  value="$23,450"
  changePercentage="15.3%"
  changeDirection="up"
  progressLabel="of target achieved"
  progressPercentage={78}
  progressBarClass="bg-grd-success"
  leftToGoal="$6,550 remaining"
/>
```

---

## StatCardWidget

**Purpose**: Displays statistical cards with charts and performance metrics.

### Interface

```typescript
interface StatCardWidgetProps {
  title: string;                    // Widget title
  value: string;                    // Primary statistic value
  subtitle: string;                 // Description text
  chartId: string;                  // Unique ID for chart container
  data?: number[];                  // Optional chart data points
  categories?: string[];            // Optional x-axis categories
  colors?: string[];               // Optional chart colors
  gradientColors?: string[];       // Optional gradient colors
  height?: number;                 // Optional chart height
  chartType?: "area" | "bar";      // Chart type
  showDropdown?: boolean;          // Optional dropdown menu
  backgroundColor?: string;         // Optional background class
  textColor?: string;              // Optional text color class
}
```

### Default Data Structure

```typescript
const defaultProps = {
  data: [14, 41, 35, 51, 25, 18, 21, 35, 15],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  colors: ["#2af598"],
  gradientColors: ["#009efd"],
  height: 240,
  chartType: "bar",
  showDropdown: false
};
```

### Usage Examples

```tsx
// Basic bar chart
<StatCardWidget
  title="Monthly Revenue"
  value="68.9%"
  subtitle="Average monthly sale for every author"
  chartId="chart12"
/>

// Area chart with background
<StatCardWidget
  title="Yearly Income"
  value="68.9%"
  subtitle="Average monthly sale for every author"
  chartId="chart14"
  chartType="area"
  data={[100, 65, 34, 51, 25, 40, 21, 35, 15]}
  colors={["#98ec2d"]}
  gradientColors={["#17ad37"]}
  height={250}
/>

// Custom styled card
<StatCardWidget
  title="Trending Products"
  value="48.2%"
  subtitle="Average monthly sale for every author"
  chartId="chart13"
  chartType="bar"
  data={[44, 55, 41]}
  backgroundColor="bg-grd-purple"
  textColor="text-white"
  colors={["#ee0979"]}
  gradientColors={["#005bea"]}
  height={237}
/>
```

---

## Common Data Patterns

### Time Series Categories
```typescript
const monthlyCategories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const quarterlyCategories = ["Q1", "Q2", "Q3", "Q4"];
const weeklyCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
```

### Color Schemes
```typescript
const blueScheme = {
  colors: ["#3b82f6"],
  gradientColors: ["#06b6d4"]
};

const greenScheme = {
  colors: ["#10b981"],
  gradientColors: ["#059669"]
};

const redScheme = {
  colors: ["#ef4444"],
  gradientColors: ["#dc2626"]
};

const purpleScheme = {
  colors: ["#8b5cf6"],
  gradientColors: ["#7c3aed"]
};
```

### Sample Data Sets
```typescript
const growthData = [10, 15, 12, 25, 18, 30, 28, 35, 40];
const volatileData = [20, 5, 60, 10, 30, 20, 25, 15, 31];
const steadyGrowth = [5, 8, 12, 16, 20, 24, 28, 32, 36];
const seasonalData = [45, 52, 48, 61, 55, 67, 43, 49, 58];
```

---

## Notes

- All chart IDs must be unique across the page to prevent conflicts
- Colors support both hex codes and CSS color names
- Data arrays should match the length of category arrays for proper chart rendering
- ApexCharts library handles responsive behavior automatically
- Progress percentages should be between 0 and 100
- Series data for radial charts should also be between 0 and 100

## Dependencies

- **ApexCharts**: Chart rendering library
- **React**: Component framework
- **TypeScript**: Type safety
- **Bootstrap**: Styling framework
