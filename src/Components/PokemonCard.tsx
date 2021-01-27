import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Center, IconButton, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IPokemon } from '../Interface/IPokemon';

function PokemonCard({
  pokemon,
  onDelete,
  onUpdate,
  selected,
  onSelect,
}: {
  pokemon: IPokemon;
  selected: boolean;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (pokemon: IPokemon) => Promise<void>;
  onSelect: (id: number) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete(id: number) {
    setIsLoading(true);
    try {
      await onDelete(id);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <Center
      onClick={() => onSelect(pokemon.id)}
      m="2"
      minH="150px"
      minW="200px"
      h="150px"
      w="200px"
      maxH="150px"
      maxW="200px"
      boxShadow="base"
      rounded="lg"
      bg={selected ? '#3bc368' : '#3ba3c3'}
    >
      <Center
        alignItems="center"
        justifyContent="center"
        w="100%"
        h="100%"
        flexDir="column"
      >
        <Center mt="2" justifyContent="center" flexDir="column" flexGrow={1}>
          <Text
            maxW="180px"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
            color="white"
          >
            Id: {pokemon.id} | Treind.: {pokemon.treinador}
          </Text>
          <Text
            maxW="180px"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
            color="white"
          >
            Lv: {pokemon.nivel} | Tipo: {pokemon.tipo}
          </Text>
        </Center>

        <Center mb="4">
          <IconButton
            mx="2"
            onClick={() => onUpdate(pokemon)}
            aria-label="Alterar o pokemon"
            colorScheme="yellow"
            icon={<EditIcon />}
          />
          <IconButton
            mx="2"
            onClick={() => handleDelete(pokemon.id)}
            isLoading={isLoading}
            aria-label="Deletar o pokemon"
            colorScheme="red"
            icon={<DeleteIcon />}
          />
        </Center>
      </Center>
    </Center>
  );
}

export default PokemonCard;
