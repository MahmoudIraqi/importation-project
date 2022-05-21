import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-charts-component',
  templateUrl: './charts-component.component.html',
  styleUrls: ['./charts-component.component.scss']
})
export class ChartsComponentComponent implements OnInit, OnChanges {

  @Input() data;
  @Input() pieData;
  @Input() currentLang;
  svg;
  margin = 50;
  width = 950 - (this.margin * 2);
  height = 450 - (this.margin * 2);

  svgPie;
  marginPie = 50;
  widthPie = 600 - (this.margin * 2);
  heightPie = 450 - (this.margin * 2);

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    d3.selectAll('svg#chart svg').remove();
    d3.selectAll('div#containerPieChart svg').remove();

    this.data && this.data.length > 0 ? this.drawBars(this.data) : null;
    this.pieData && this.pieData.length > 0 ? this.drawPieChart(this.pieData) : null;
  }

  ngOnInit(): void {
  }

  drawBars(data: any[]): void {
    this.svg = d3.select('svg#chart')
      .append('svg')
      .attr('width', this.width + (this.margin * 2))
      .attr('height', this.height + (this.margin * 2))
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')')
      .attr('font-size', '14px');

    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.title))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', '')
      .attr('font-size', '14px');

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.value))])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g')
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.title))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => this.height - y(d.value))
      .attr('fill', '#c28a30');
  }

  drawPieChart(data: any[]): void {
    this.svgPie = d3.select('div#containerPieChart')
      .append('svg')
      .attr('width', this.widthPie)
      .attr('height', this.heightPie)
      .append('g')
      .attr('transform', 'translate(' + this.widthPie / 2 + ',' + this.heightPie / 2 + ')');

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min(this.widthPie, this.heightPie) / 2 - 1);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

    const pie = d3.pie()
      .value(d => d.value);

    const arcs = pie(data);

    const radius = Math.min(this.widthPie, this.heightPie) / (2 * 0.8);

    const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

    this.svgPie.append('g')
      .attr('stroke', 'white')
      .selectAll('path')
      .data(arcs)
      .join('path')
      .attr('fill', d => color(d.data.color))
      .attr('d', arc)
      .append('title')
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    this.pieData.map(x => {
      x.color = color(x.color);
    });
  }
}
