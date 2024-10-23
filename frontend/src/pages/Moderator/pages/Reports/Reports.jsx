import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner, Card, CardBody, Typography } from "@material-tailwind/react";
import auth from "../../../../helpers/Auth";

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getReports = async (signal) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.isAuthenticated().token)}`,
        },
        cancelToken: signal,
      };

      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/report`,
        config
      );
      setReports(response.data.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getReports(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, []);

  if (loading) {
    return <Spinner className="h-6 w-6" />;
  }

  console.log(reports);

  return (
    <section className="p-4">
      <div className="mx-auto max-w-screen-lg">
        <Typography variant="h4">Reports</Typography>
        <CardBody className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-8">
          {reports &&
            reports.map(
              (report, index) =>
                report.postId && (
                  <Card
                    key={index}
                    onClick={() => navigate(`/post/${report.postId._id}`)}
                    className="border border-gray-300 overflow-hidden shadow-sm h-full cursor-pointer hover:shadow-lg hover:shadow-gray-400 transition-shadow duration-300"
                  >
                    <CardBody>
                      <img
                        className="rounded-md mb-2 h-24 md:h-32 w-full object-cover rounded-xl"
                        alt={`${report.postId && report.postId.name}`}
                        src={`${report.postId && report.postId.images[0]}`}
                      />
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mb-2"
                      >
                        {report.postId && report.postId.name}
                      </Typography>
                      <Typography>{report.message}</Typography>
                    </CardBody>
                  </Card>
                )
            )}
        </CardBody>
      </div>
    </section>
  );
};
