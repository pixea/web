import React from 'react'

import { Container, Flex, Spacer, Box, Image, Link, Button} from "@chakra-ui/react"

import logotype from '../images/Logotype.svg'

function Navigation() {
  return (
    <Container maxW="container.lg">
        <Flex alignItems="center">
            <Box>
                <Image
                    boxSize="100px"
                    src={logotype}
                    alt="pixea logo"
                />
            </Box>
            <Spacer />
            <Box>
                <Link mx={5} fontWeight="medium" color="dark.500" _hover={{color: "blue.800"}}>Domov</Link>
                <Link mx={5} fontWeight="medium" color="dark.500" _hover={{color: "blue.800"}}>Fotografie</Link>
                <Link mx={5} fontWeight="medium" color="dark.500" _hover={{color: "blue.800"}}>Panely</Link>
                <Link mx={5} fontWeight="medium" color="dark.500" _hover={{color: "blue.800"}}>Plátna</Link>
                <Link mx={5} fontWeight="medium" color="dark.500" _hover={{color: "blue.800"}}>Magnetky</Link>
                <Link mx={5} fontWeight="medium" color="dark.500" _hover={{color: "blue.800"}}>Kontakt</Link>
            </Box>
            <Spacer />
            <Box>
                <Button borderRadius="full"  bgColor="blue.500" color="light" _hover={{backgroundColor: "blue.800"}}>Aplikácia</Button>
            </Box>
        </Flex>
    </Container>
  );
}

export default Navigation;
