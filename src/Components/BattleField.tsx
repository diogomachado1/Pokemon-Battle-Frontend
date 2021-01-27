import { Button, Center, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { IPokemon } from '../Interface/IPokemon';

function BattleField({
  pokemonA,
  pokemonB,
  getAllPokemons,
  setSelected,
}: {
  getAllPokemons: () => Promise<void>;
  setSelected: Dispatch<SetStateAction<(number | undefined)[]>>;
  pokemonA?: IPokemon;
  pokemonB?: IPokemon;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPokemonDead, setIsLastPokemonDead] = useState<string>('');
  const [battleResult, setBattleResult] = useState<
    | {
        vencedor: IPokemon;
        perdedor: IPokemon;
      }
    | undefined
  >(undefined);

  async function handleBattle(idA: number, idB: number) {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/batalhar/${idA}/${idB}`
      );

      if (response.data.perdedor.nivel === 0) {
        setBattleResult(undefined);
        setIsLastPokemonDead(
          response.data.perdedor.id === pokemonA?.id ? 'A' : 'B'
        );
        setSelected((selected) =>
          selected.map((item) =>
            item === response.data.perdedor.id &&
            response.data.perdedor.nivel === 0
              ? undefined
              : item
          )
        );
      } else {
        setIsLastPokemonDead('');
        setBattleResult(response.data);
      }
      await getAllPokemons();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <Center
      flexDir="column"
      minH={{ md: '250px', sm: '500px' }}
      h={{ md: '250px', sm: '500px' }}
      maxH={{ md: '250px', sm: '500px' }}
    >
      <Center flexDir={['column', 'column', 'row']}>
        {pokemonA ? (
          <Center flexDir="column">
            <Center
              m="2"
              minH="100px"
              minW="200px"
              h="100px"
              w="200px"
              maxH="100px"
              maxW="200px"
              boxShadow="base"
              rounded="lg"
              bg="#c33b59"
            >
              <Center
                alignItems="center"
                justifyContent="center"
                w="100%"
                h="100%"
                flexDir="column"
              >
                <Center
                  mt="2"
                  justifyContent="center"
                  flexDir="column"
                  flexGrow={1}
                >
                  <Text
                    maxW="180px"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    color="white"
                  >
                    Id: {pokemonA.id} | Treind.: {pokemonA.treinador}
                  </Text>
                  <Text
                    maxW="180px"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    color="white"
                  >
                    Lv: {pokemonA.nivel} | Tipo: {pokemonA.tipo}
                  </Text>
                </Center>
              </Center>
            </Center>
            {(battleResult || (isLastPokemonDead && !pokemonB)) && (
              <Heading
                m="2"
                bgGradient="linear(to-l, #7928CA,#FF0080)"
                bgClip="text"
                fontSize="xl"
                maxW="180px"
                fontWeight="extrabold"
              >
                {(isLastPokemonDead && !pokemonB) ||
                battleResult?.vencedor.id === pokemonA.id
                  ? 'VENCEU!'
                  : 'PERDEU!'}
              </Heading>
            )}
          </Center>
        ) : (
          <Heading
            m="2"
            bgGradient="linear(to-l, #7928CA,#FF0080)"
            bgClip="text"
            fontSize="xl"
            fontWeight="extrabold"
          >
            {isLastPokemonDead === 'A'
              ? 'MORREU! ESCOLHA OUTRO POKEMON'
              : 'Pokemon A'}
          </Heading>
        )}
        <Heading
          m="2"
          bgGradient="linear(to-l, #7928CA,#FF0080)"
          bgClip="text"
          fontSize="6xl"
          fontWeight="extrabold"
        >
          VS
        </Heading>
        {pokemonB ? (
          <Center flexDir="column">
            <Center
              m="2"
              minH="100px"
              minW="200px"
              h="100px"
              w="200px"
              maxH="100px"
              maxW="200px"
              boxShadow="base"
              rounded="lg"
              bg="#c33b59"
            >
              <Center
                alignItems="center"
                justifyContent="center"
                w="100%"
                h="100%"
                flexDir="column"
              >
                <Center
                  mt="2"
                  justifyContent="center"
                  flexDir="column"
                  flexGrow={1}
                >
                  <Text
                    maxW="180px"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    color="white"
                  >
                    Id: {pokemonB.id} | Treind.: {pokemonB.treinador}
                  </Text>
                  <Text
                    maxW="180px"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    color="white"
                  >
                    Lv: {pokemonB.nivel} | Tipo: {pokemonB.tipo}
                  </Text>
                </Center>
              </Center>
            </Center>
            {((isLastPokemonDead && !pokemonA) || battleResult) && (
              <Heading
                m="2"
                maxW="180px"
                bgGradient="linear(to-l, #7928CA,#FF0080)"
                bgClip="text"
                fontSize="xl"
                fontWeight="extrabold"
              >
                {(isLastPokemonDead && !pokemonA) ||
                battleResult?.vencedor.id === pokemonB.id
                  ? 'VENCEU!'
                  : 'PERDEU!'}
              </Heading>
            )}
          </Center>
        ) : (
          <Heading
            m="2"
            bgGradient="linear(to-l, #7928CA,#FF0080)"
            bgClip="text"
            fontSize="xl"
            maxW="200px"
            fontWeight="extrabold"
          >
            {isLastPokemonDead === 'B'
              ? 'MORREU! ESCOLHA OUTRO POKEMON'
              : 'Pokemon B'}
          </Heading>
        )}
      </Center>
      {pokemonA && pokemonB && (
        <Center m="2">
          <Button
            onClick={() => handleBattle(pokemonA.id, pokemonB.id)}
            isLoading={isLoading}
            colorScheme="purple"
          >
            BATALHAR!
          </Button>
        </Center>
      )}
    </Center>
  );
}

export default BattleField;
