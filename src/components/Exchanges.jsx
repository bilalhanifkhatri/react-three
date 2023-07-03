import axios from "axios";
import { server } from "../index";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import {
  Container,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import ErrorComponent from "./ErrorComponent";

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const { data } = await axios.get(`${server}/exchanges`);
        setExchanges(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchExchanges();
  }, []);

  if (error) {
    return <ErrorComponent message={"Error while fetching Exchanges"} />;
  }

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
            {exchanges.map((i) => (
              <ExchangeCard
                key={i.id}
                name={i.name}
                img={i.image}
                rank={i.trust_score_rank}
                url={i.url}
              />
            ))}
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Exchanges;

const ExchangeCard = ({ name, img, rank, url }) => (
  <a href={url} target="blank">
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
        {rank}
      </Heading>
      <Text noOfLines={"1"}>{name}</Text>
    </VStack>
  </a>
);
