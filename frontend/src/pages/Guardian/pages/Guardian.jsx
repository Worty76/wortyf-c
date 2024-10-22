import React, { useEffect, useState } from "react";
import { GuardiansList } from "../components/GuardiansList";
import axios from "axios";
import { Typography } from "@material-tailwind/react";

export const Guardian = () => {
  const [guardians, setGuardians] = useState([]);

  const getGuardians = async (signal) => {
    try {
      await axios
        .get(`${process.env.REACT_APP_API}/api/user/guardians`, {
          cancelToken: signal,
        })
        .then((response) => {
          setGuardians(response.data.data);
        })
        .catch(function (thrown) {
          if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getGuardians(source.token);
    return () => {
      source.cancel("Operation canceled by the user.");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(guardians);

  return (
    <section className="p-4">
      <div className="mx-auto max-w-screen-lg">
        <Typography variant="h4">Guardians</Typography>
        <GuardiansList guardians={guardians} />
      </div>
    </section>
  );
};
