import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    console.log(payload)
    return (
      <div className="custom-tooltip" style={{background:"#fffe" , padding:"5px", display:"flex", flexFlow:"column"}}>
        <p className="label" style={{color:"#000"}}>{`${label.length>12?label.slice(0,12)+'...':label}`}</p>
        <p className="intro" style={{color:"#333"}}>{`${payload[0].dataKey} : ${payload[0].value}`}</p>
        <p className="intro" style={{color:"#333"}}>{`${payload[1].dataKey} : ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
};

export default class Barcharts extends PureComponent {


  render() {
    let {data} = this.props;
    return (
      <>
        <BarChart 
        width={196} 
        height={196} 
        data={data} 
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
        >
          
        
        <CartesianGrid stroke="transparent" strokeDasharray="3 3"/>
        
        <XAxis dataKey="name" />
          
        <Tooltip dataKey="name" content={CustomTooltip}/>
        <Legend />
        <Bar dataKey="Ordered" fill="rgb(251 222 135 / 89%)" />
        <Bar dataKey="Delivered" fill="rgb(28, 179, 98)" />
        
      </BarChart>
      </>
    );
  }
}
