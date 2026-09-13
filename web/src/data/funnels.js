// Approved, precomputed presentation values from the validated Python analysis.
// The frontend displays these values; it does not calculate funnel membership.
export const customerFunnel = {
  id: "customer-funnel-chart",
  tone: "customer",
  accent: "#71c6b1",
  connectorColor: "rgba(113, 198, 177, 0.24)",
  colors: ["#71c6b1", "#68b8a3", "#5da68f", "#528f7c"],
  stages: [
    {
      stage: "Download",
      count: 23608,
      percentOfPrevious: "N/A",
      percentOfTop: "100.00%",
    },
    {
      stage: "Signup",
      count: 17623,
      percentOfPrevious: "74.65%",
      percentOfTop: "74.65%",
    },
    {
      stage: "Requested ≥1",
      count: 12406,
      percentOfPrevious: "70.40%",
      percentOfTop: "52.55%",
    },
    {
      stage: "Completed ≥1",
      count: 6233,
      percentOfPrevious: "50.24%",
      percentOfTop: "26.40%",
    },
  ],
};

export const rideFunnel = {
  id: "ride-funnel-chart",
  tone: "ride",
  accent: "#73c991",
  connectorColor: "rgba(115, 201, 145, 0.26)",
  colors: ["#73c991", "#69b783", "#60a576", "#57986c"],
  stages: [
    {
      stage: "Request",
      count: 385477,
      percentOfPrevious: "N/A",
      percentOfTop: "100.00%",
    },
    {
      stage: "Finished",
      count: 223652,
      percentOfPrevious: "58.02%",
      percentOfTop: "58.02%",
    },
    {
      stage: "Paid",
      count: 212628,
      percentOfPrevious: "95.07%",
      percentOfTop: "55.16%",
    },
    {
      stage: "Reviewed",
      count: 148464,
      percentOfPrevious: "69.82%",
      percentOfTop: "38.51%",
    },
  ],
};
