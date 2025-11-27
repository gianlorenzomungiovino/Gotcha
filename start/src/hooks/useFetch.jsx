import useSWR from "swr";

const fetcher = (url) => fetch(url).then((response) => response.json());

export function useFetch() {
  const { data, error } = useSWR(
    "https://mocki.io/v1/81d5be0e-b6bc-475e-9b38-4addfa52c6cb",
    fetcher
  );

  return { data, error };
}
