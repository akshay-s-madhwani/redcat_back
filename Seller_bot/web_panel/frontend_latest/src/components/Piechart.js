import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Legend, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['rgb(243, 255, 186)', '#6474c3', '#FFBB28', '#FF00FF'];

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{display: 'flex',flexFlow:'column',marginLeft:'3rem',marginBottom:'-5rem', gap: '0px',fontSize:16}}>
      {
        payload.map((entry, index) => (
          <div>
          <p><p style={{width:10,height:10,background:entry.payload.fill,display:'inline-block',margin:0,marginRight:10}}></p>{entry.payload.name} :{entry.payload.value}</p></div>
        ))
      }
    </div>
  );
}

export default class Piechart extends PureComponent {
 

  render() {
    let {data} = this.props;
    return (

      <PieChart width={200} height={260} onMouseEnter={this.onPieEnter}>
        <Pie
          data={data}
          cx={100}
          cy={180}
          innerRadius={40}
          outerRadius={60}
          fill="#8884d8"
          paddingAngle={6}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend content={renderLegend}/>
        <Tooltip/>
      </PieChart>
    );
  }
}
