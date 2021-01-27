import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IPokemon } from '../Interface/IPokemon';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const pokemonTypes = ['charizard', 'mewtwo', 'pikachu'];

const schema = yup.object().shape({
  id: yup.number().integer(),
  treinador: yup.string().required(),
  tipo: yup.mixed().oneOf(pokemonTypes).required(),
  nivel: yup.number().integer().positive(),
});

function PokemonFormModal({
  initialValue,
  handleClose,
  isOpen,
}: {
  initialValue?: Partial<IPokemon>;
  isOpen: boolean;
  handleClose: (needReload?: boolean) => void;
}) {
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    reset(initialValue);
  }, [initialValue, reset]);

  const onSubmit = async ({ id, treinador, tipo }: IPokemon) => {
    setIsLoading(true);
    try {
      if (initialValue?.id) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/pokemons/${initialValue.id}`,
          {
            treinador,
          }
        );
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/pokemons`, {
          treinador,
          tipo,
        });
      }
      setIsLoading(false);
      handleClose(true);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Modal isOpen={isOpen} onClose={() => handleClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Salvar Pokemon</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            p="2"
            width="100%"
            flexDir="column"
            as="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            {initialValue?.id && (
              <FormControl isDisabled={isLoading} my="2" id="id">
                <FormLabel>Id:</FormLabel>
                <Input
                  variant="filled"
                  type="number"
                  placeholder="id"
                  name="id"
                  disabled
                  ref={register}
                />
              </FormControl>
            )}
            <FormControl isDisabled={isLoading} my="2" id="treinador">
              <FormLabel>Treinador:</FormLabel>
              <Input
                variant="filled"
                placeholder="Treinador"
                name="treinador"
                ref={register}
              />
            </FormControl>
            <FormControl isDisabled={isLoading} my="2" id="tipo">
              <FormLabel>Tipo do pokemon:</FormLabel>
              <Select
                variant="filled"
                placeholder="Tipo do pokemon"
                name="tipo"
                ref={register}
              >
                {pokemonTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </FormControl>
            {initialValue?.id && (
              <FormControl isDisabled={isLoading} my="2" id="nivel">
                <FormLabel>Nível</FormLabel>
                <Input
                  variant="filled"
                  type="number"
                  placeholder="Nível"
                  name="nivel"
                  disabled
                  ref={register}
                />
              </FormControl>
            )}
            <Box my="4" display="flex" alignItems="flex-end">
              <Button
                isLoading={isLoading}
                disabled={isLoading}
                type="submit"
                colorScheme="teal"
              >
                Salvar
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PokemonFormModal;
