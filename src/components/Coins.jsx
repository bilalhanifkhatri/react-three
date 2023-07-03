import axios from "axios";
import { server } from "../index";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import {
  Button,
  Container,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import ErrorComponent from "./ErrorComponent";
import { Link } from "react-router-dom";

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("pkr");
  const currencySymbol =
    currency === "pkr" ? "Rs" : currency === "eur" ? "€" : "$";
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(
          `${server}/coins/markets?vs_currency=${currency}&page=${page}`
        );
        setCoins(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchCoins();
  }, [currency, page]);

  if (error) {
    return <ErrorComponent message={"Error while fetching Coins"} />;
  }

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <HStack wrap={"wrap"}>
            {coins.map((i) => (
              <CoinCard
                id={i.id}
                key={i.id}
                name={i.name}
                img={i.image}
                symbol={i.symbol}
                price={i.current_price}
                currencySymbol={currencySymbol}
              />
            ))}
          </HStack>
          <HStack
            justifyContent={"space-between"}
            m={"8"}
            shadow={"base"}
            borderRadius={"base"}
          >
            <Button
              bgColor={"blackAlpha.900"}
              color={"white"}
              onClick={() => {
                if (page === 1) {
                  console.log("Current page is :", page);
                } else {
                  setPage(page - 1);
                  setLoading(true);
                }
              }}
            >
              Previous
            </Button>
            <Text>Current Page: {page}</Text>
            <Button
              bgColor={"blackAlpha.900"}
              color={"white"}
              onClick={() => {
                if (page < 133) {
                  setPage(page + 1);
                  setLoading(true);
                } else {
                  console.log("maximum pages are 132");
                }
              }}
            >
              Next
            </Button>
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Coins;

const CoinCard = ({ id, name, img, symbol, price, currencySymbol = "Rs" }) => (
  <Link to={`/coin/${id}`}>
    <VStack
      w={"52"}
      shadow={"lg"}
      borderRadius={"lg"}
      p={"8"}
      m={"8"}
      transition={"all 0.3s"}
      css={{
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <Image
        src={img}
        alt={"Exchange Image"}
        w={"10"}
        h={"10"}
        objectFit={"contain"}
      />
      <Heading size={"md"} noOfLines={"1"}>
        {symbol}
      </Heading>
      <Text noOfLines={"1"}>{name}</Text>
      <Text noOfLines={"1"}>
        {price ? `${currencySymbol}: ${price}` : "NA"}
      </Text>
    </VStack>
  </Link>
);
