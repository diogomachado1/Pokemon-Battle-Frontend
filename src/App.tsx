import React, { useEffect, useState } from 'react';
import {
  Box,
  Center,
  ChakraProvider,
  Heading,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import { IPokemon } from './Interface/IPokemon';
import PokemonCard from './Components/PokemonCard';
import PokemonFormModal from './Components/PokemonFormModal';
import { AddIcon } from '@chakra-ui/icons';
import BattleField from './Components/BattleField';

function App() {
  const [pokemons, setPokemons] = useState<IPokemon[]>([]);
  const [editPokemon, setEditPokemon] = useState<
    Partial<IPokemon> | undefined
  >();

  const [selectedPokemons, setSelectedPokemons] = useState<
    (number | undefined)[]
  >([]);
  const [showPokemonFormModal, setShowPokemonFormModal] = useState(false);

  async function getAllPokemons() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/pokemons`
      );
      setIsLoading(false);

      setPokemons(response.data);
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function selectPokemon(id: number) {
    if (selectedPokemons.includes(id)) {
      setSelectedPokemons(
        selectedPokemons.map((item) => (item === id ? undefined : item))
      );
    } else if (!selectedPokemons[0] || !selectedPokemons[1]) {
      const newArray = selectedPokemons[0]
        ? [selectedPokemons[0], id]
        : [id, selectedPokemons[1]];
      setSelectedPokemons(newArray);
    }
  }

  const [isLoading, setIsLoading] = useState(false);

  async function onEdit(pokemon: IPokemon) {
    setShowPokemonFormModal(true);
    setEditPokemon(pokemon);
  }

  async function deletePokemon(id: number) {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/pokemons/${id}`);

      await getAllPokemons();
    } catch (error) {}
  }
  useEffect(() => {
    getAllPokemons();
  }, []);

  // 2. Use at the root of your app
  return (
    <ChakraProvider>
      <Box w="100%" h="100vh">
        <Center>
          <Heading color="#21233d" m="4">
            Batalha de Pokemons!
          </Heading>
        </Center>
        <IconButton
          zIndex="999"
          position="fixed"
          right="0"
          bottom="20px"
          onClick={() => {
            setShowPokemonFormModal(true);
          }}
          m="2"
          aria-label="Novo Pokemon"
          colorScheme="teal"
          size="lg"
          icon={<AddIcon />}
        />
        <BattleField
          setSelected={setSelectedPokemons}
          getAllPokemons={getAllPokemons}
          pokemonA={pokemons.find((item) => item.id === selectedPokemons[0])}
          pokemonB={pokemons.find((item) => item.id === selectedPokemons[1])}
        />
        <Center flexWrap="wrap">
          {pokemons.map((item) => (
            <PokemonCard
              selected={selectedPokemons.includes(item.id)}
              onSelect={selectPokemon}
              pokemon={item}
              key={item.id}
              onUpdate={onEdit}
              onDelete={deletePokemon}
            />
          ))}
        </Center>
        <PokemonFormModal
          initialValue={editPokemon}
          isOpen={showPokemonFormModal}
          handleClose={async (needReload?: boolean) => {
            setShowPokemonFormModal(false);
            setEditPokemon({});
            if (needReload) {
              await getAllPokemons();
            }
          }}
        />
      </Box>
      {isLoading && (
        <Center
          top="0"
          background="#555c"
          position="fixed"
          minH="100vh"
          minW="100vw"
        >
          <Spinner color="#fff" />
        </Center>
      )}
    </ChakraProvider>
  );
}

export default App;
