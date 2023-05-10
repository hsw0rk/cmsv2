import images from "./images";
import axios from "axios";

const data = {
  user: {
    name: "Tuatta",
    img: images.avt,
  },
  summary: [
    {
      title: "Users",
      subtitle: "Total",
      value: "",
      percent: '',
      endpoint: "/investmentsCount", // Add endpoint for investments count
    },
    {
      title: "Pending Approval",
      subtitle: "Total",
      value: "",
      percent: '',
      endpoint: "/homeloansCount", // Add endpoint for home loans count
    },
  ],
  revenueSummary: {
    title: "Revenue",
    value: "$678",
    chartData: {
      labels: ["May", "Jun", "July", "Aug", "May", "Jun", "July", "Aug"],
      data: [300, 300, 280, 380, 200, 300, 280, 350],
    },
  },
  overall: [
    {
      value: "300K",
      title: "Orders",
    },
    {
      value: "9.876K",
      title: "Customers",
    },
    {
      value: "1.234K",
      title: "Products",
    },
    {
      value: "$5678",
      title: "Revenue",
    },
  ],
  revenueByChannel: [
    {
      title: "Direct",
      value: 70,
    },
    {
      title: "External search",
      value: 40,
    },
    {
      title: "Referal",
      value: 60,
    },
    {
      title: "Social",
      value: 30,
    },
  ],
  revenueByMonths: {
    labels: [
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
    ],
    data: [250, 200, 300, 280, 100, 220, 310, 190, 200, 120, 250, 350],
  },
};

export const fetchData = async (token) => {
    const endpoints = ['/investmentscount', '/homeloanscount'];
  
    try {
      const results = await Promise.all(
        endpoints.map(endpoint => axios.get(`http://localhost:8800/api/auth${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }))
      );
  
      const counts = results.map(result => {
        const count = result.data[0][Object.keys(result.data[0])[0]];
        return count;
      });
  
      return counts;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  

export { data };
