import React, { useEffect, useState } from "react";
import * as d3 from "d3";

type Pet = {
  id: number;
  name: string;
  status: "available" | "pending" | "sold";
};

export default function Dashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      "https://petstore.swagger.io/v2/pet/findByStatus?status=available,pending,sold"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch pets");
        return res.json();
      })
      .then((data) => setPets(data))
      .catch((err) => setError(err.message));
  }, []);

  const statusCounts = pets.reduce<Record<string, number>>(
    (acc, pet) => {
      acc[pet.status] = (acc[pet.status] || 0) + 1;
      return acc;
    },
    { available: 0, pending: 0, sold: 0 }
  );

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  const lineData = React.useMemo(() => {
    const buckets = Array(10).fill(0);
    pets.forEach((pet) => {
      buckets[pet.id % 10] = (buckets[pet.id % 10] || 0) + 1;
    });
    return buckets.map((count, i) => ({ x: i, count }));
  }, [pets]);

  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(["available", "pending", "sold"])
    .range(["#10B981", "#FBBF24", "#EF4444"]); // green, yellow, red

  // Bar Chart useEffect (styled with rounded bars, consistent colors, etc)
  useEffect(() => {
    const data = pieData;
    const width = 520,
      height = 320,
      margin = { top: 30, right: 20, bottom: 40, left: 50 };

    const svg = d3
      .select("#bar-chart")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible")
      .style("box-shadow", "0 2px 6px rgba(0,0,0,0.1)")
      .style("border-radius", "8px");

    svg.selectAll("*").remove();

    // Assuming you use tailwind dark mode class on <html> or <body>
    const isDarkMode = document.documentElement.classList.contains("class");

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", isDarkMode ? "#1f2937" : "#ffffff") // gray-800 or white
      .attr("rx", 8)
      .attr("ry", 8);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.status))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("fill", "#4F46E5")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.status)!)
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => y(0) - y(d.count))
      .attr("width", x.bandwidth())
      .attr("rx", 6);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .attr("font-size", "13px")
      .attr("color", isDarkMode ? "#D1D5DB" : "#4B5563"); // gray-300 or gray-700

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .attr("font-size", "13px")
      .attr("color", isDarkMode ? "#D1D5DB" : "#4B5563");
  }, [statusCounts]);

  // Pie Chart
  useEffect(() => {
    const width = 320,
      height = 320,
      radius = Math.min(width, height) / 2;

    const svg = d3
      .select("#pie-chart")
      .attr("width", width)
      .attr("height", height)
      .style("background", "white")
      .style("border-radius", "8px")
      .style("box-shadow", "0 2px 8px rgba(0,0,0,0.12)")
      .style("overflow", "visible");

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie<{ status: string; count: number }>()
      .value((d) => d.count)(pieData);
    const arc = d3
      .arc<d3.PieArcDatum<{ status: string; count: number }>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const arcs = g.selectAll("arc").data(pie).join("g").attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.data.status));

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .attr("text-anchor", "middle")
      .text((d) => d.data.count);
  }, [statusCounts]);

  // Doughnut Chart
  useEffect(() => {
    const width = 320,
      height = 320,
      radius = Math.min(width, height) / 2;

    const svg = d3
      .select("#doughnut-chart")
      .attr("width", width)
      .attr("height", height)
      .style("background", "white")
      .style("border-radius", "8px")
      .style("box-shadow", "0 2px 8px rgba(0,0,0,0.12)")
      .style("overflow", "visible");

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie<{ status: string; count: number }>()
      .value((d) => d.count)(pieData);
    const arc = d3
      .arc<d3.PieArcDatum<{ status: string; count: number }>>()
      .outerRadius(radius - 10)
      .innerRadius(radius / 2);

    const arcs = g.selectAll("arc").data(pie).join("g").attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.data.status));

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .attr("text-anchor", "middle")
      .text((d) => d.data.count);
  }, [statusCounts]);

  // Line Chart
  useEffect(() => {
    const data = lineData;
    const width = 520,
      height = 320,
      margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3
      .select("#line-chart")
      .attr("width", width)
      .attr("height", height)
      .style("background", "white")
      .style("border-radius", "8px")
      .style("box-shadow", "0 2px 6px rgba(0,0,0,0.1)")
      .style("overflow", "visible");

    svg.selectAll("*").remove();

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x) as [number, number])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<{ x: number; count: number }>()
      .x((d) => x(d.x))
      .y((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(10))
      .attr("font-size", "13px")
      .attr("color", "#4B5563");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .attr("font-size", "13px")
      .attr("color", "#4B5563");

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4F46E5")
      .attr("stroke-width", 3)
      .attr("d", line);
  }, [lineData]);

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-extrabold mb-10 tracking-tight">Petstore</h1>

      {error && (
        <div className="mb-6 text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900 p-4 rounded shadow">
          Error loading pets: {error}
        </div>
      )}

      {/* Keep main cards as single row unchanged */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {["available", "pending", "sold"].map((status) => (
          <div
            key={status}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-between"
          >
            <div>
              <h2 className="text-lg capitalize font-semibold">{status}</h2>
              <p className="mt-2 text-4xl font-bold">
                {statusCounts[status] || 0}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                pets
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full ${
                status === "available"
                  ? "bg-green-300 dark:bg-green-600"
                  : status === "pending"
                  ? "bg-yellow-300 dark:bg-yellow-600"
                  : "bg-red-300 dark:bg-red-600"
              } flex items-center justify-center`}
              aria-hidden="true"
            >
              <span className="text-white text-lg font-bold">
                {status[0].toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Chart section with refined styling */}
      <section className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-center">Bar Chart</h3>
          <svg id="bar-chart" className="mx-auto" />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-center">Line Chart</h3>
          <svg id="line-chart" className="mx-auto" />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-center">Pie Chart</h3>
          <svg id="pie-chart" className="mx-auto" />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-center">
            Doughnut Chart
          </h3>
          <svg id="doughnut-chart" className="mx-auto" />
        </div>
      </section>

      {/* Pets table as is */}
      <section className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow mb-12 p-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {pets.length > 0 ? (
              pets.slice(0, 20).map(({ id, name, status }) => (
                <tr
                  key={id}
                  className="hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{name}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400"
                >
                  Loading pets...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
