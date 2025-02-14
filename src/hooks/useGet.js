import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

const useGet = (url, axios) => {
  
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getData = async () => {
    try {
      const { data } = await axios.get(url);
      setState(data.data || data);
      setLoading(false);
    } catch (error) {
      // toast.error("Error en la conexión");
      setError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return [state, loading, getData,error,setState];
};

export default useGet;