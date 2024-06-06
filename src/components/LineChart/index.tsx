import { LineChart } from "@mui/x-charts";

type SLCProps = {
  xValues: number[];
  yValues: number[];
  xLabel: string,
  yLabel: string
}

export default function SimpleLineChart({ xValues, yValues, xLabel, yLabel }: SLCProps) {

  return <>
    <LineChart
      width={600}
      height={500}
      series={[{ 
        data: yValues,
        label: yLabel
      }]}
      grid={{ vertical: true, horizontal:true }}
      xAxis={[{ 
        data: xValues,
        label: xLabel,
        tickMinStep: 10,
        tickMaxStep: 50,
        labelFontSize: 20,
      }]}
      yAxis={[{ 
        tickFontSize: 20,
        tickMinStep: 5,
        tickMaxStep: 40,
      }]}
    />
  </>
    
}