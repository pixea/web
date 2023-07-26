import * as React from "react"

import { ChakraProvider, extendTheme, Container, Box, Flex, Spacer, Heading, Text, Button } from "@chakra-ui/react"
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import myTheme from "../theme"

import Navigation from '../components/Navigation'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faGem, faLayerGroup, faExpandAlt, faArrowsAltV, faSortAmountUp, faSortAmountUpAlt, faTint, faThumbtack, faSun, faStickyNote, faStar } from '@fortawesome/free-solid-svg-icons'

const theme = extendTheme(myTheme)

const IndexPage = () => {
  return (
    <main>
      <ChakraProvider theme={theme}>
        
        <Navigation />

        <Container maxW="container.lg" py={48}>
          <Heading as="h1" size="4xl" color="dark.500" textAlign="center" mb={6}>Dotknite sa svojich spomienok</Heading>
          <Flex justify="center">
            <Button fontSize="lg" bgColor="magenta.500" color="light" borderRadius="full" _hover={{backgroundColor: "magenta.800"}}>Vyvolať fotografie</Button>
          </Flex>
        </Container>

        <Container maxW="container.lg" mb={7} centerContent>
          <Button position="absolute" borderRadius="full" bgColor="magenta.500" px={3} py={7} _hover={{backgroundColor: "magenta.800"}}><ChevronDownIcon color="light" w="8" h="8" /></Button>
        </Container>

        <Box bgImage="url('../../fotografia.png')" bgPosition="center" bgRepeat="no-repeat" bgSize="cover" bgAttachment="fixed" py={80}>
          <Container maxW="container.lg">
            <Box color="light">
              <Heading size="3xl" mb={6}>
                Fotografie
              </Heading>
              <Text fontSize="2xl" mb={4} fontWeight="base">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</Text>
            </Box>
            <Box mb={8}>
              <Flex wrap="wrap">
                <Box color="light" textAlign="center" mr={10} w="120px">
                  <Text fontWeight="medium" fontSize="7xl">22</Text>
                  <Text fontWeight="medium" fontSize="xl">rôznych formátov</Text>
                </Box>
                <Box color="light" textAlign="center" mr={10} w="120px">
                  <Text fontWeight="medium" fontSize="7xl">250</Text>
                  <Text fontWeight="medium" fontSize="xl">g/m<sup>2</sup> gramáž</Text>
                </Box>
                <Box color="light" textAlign="center" mr={10} w="120px">
                  <Text fontWeight="medium" fontSize="7xl">2</Text>
                  <Text fontWeight="medium" fontSize="xl">povrchové úpravy</Text>
                </Box>
                <Box color="light" textAlign="center" mr={10} mt={7} w="120px">
                  <Text mb={5}><FontAwesomeIcon icon={faTint} size="4x" /></Text>
                  <Text fontWeight="medium" fontSize="xl">verné podanie farieb</Text>
                </Box>
                <Box color="light" textAlign="center" mr={10} mt={7} w="120px">
                  <Text mb={5}><FontAwesomeIcon icon={faStickyNote} size="4x" /></Text>
                  <Text fontWeight="medium" fontSize="xl">možnosť laminovania</Text>
                </Box>
              </Flex>
            </Box>
            <Box color="light">
              <Flex wrap="wrap">
                <Text fontSize="2xl" mb={8} mr={6} fontWeight="medium">Od 0,20 € / kus</Text>
                <Button color="light" bgColor="transparent" border="2px" borderColor="light" p={5} fontSize="lg" _hover={{backgroundColor: "light", borderColor: "transparent", color: "blue.500"}}>Dozvedieť sa viac <ChevronRightIcon w="7" h="7" /></Button>
              </Flex>
            </Box>
          </Container>
        </Box>

        <Box bgImage="url('../../panel.png')" bgPosition="center" bgRepeat="no-repeat" bgSize="cover" bgAttachment="fixed" py={80}>
          <Container maxW="container.lg">
            <Box color="light">
              <Heading size="3xl" mb={6}>
                Panely
              </Heading>
              <Text fontSize="xl" mb={6} fontWeight="base">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</Text>
            </Box>
            <Box mb={8}>
              <Flex wrap="wrap">
                <Box color="light" textAlign="center" mr={10} w="120px">
                  <Text fontWeight="medium" fontSize="6xl">9</Text>
                  <Text fontWeight="medium" fontSize="lg">rôznych formátov</Text>
                </Box>
                <Box color="light" textAlign="center" mr={10} w="120px">
                  <Text fontWeight="medium" fontSize="6xl">4</Text>
                  <Text fontWeight="medium" fontSize="lg">rôzne hrúbky</Text>
                </Box>
                <Box color="light" textAlign="center" mr={10} w="120px">
                  <Text fontWeight="medium" fontSize="6xl">3</Text>
                  <Text fontWeight="medium" fontSize="lg">rôzne materiály</Text>
                </Box>
                <Box color="light" textAlign="center" mr={10} w="120px">
                  <Text fontWeight="medium" fontSize="6xl"><FontAwesomeIcon icon={faTint} size="5xl" /></Text>
                  <Text fontWeight="medium" fontSize="lg">odolnosť voči vlhkosti</Text>
                </Box>
                <Box color="light" textAlign="center" mr={10} w="120px">
                  <Text fontWeight="medium" fontSize="6xl"><FontAwesomeIcon icon={faStar} size="5xl" /></Text>
                  <Text fontWeight="medium" fontSize="lg">laminovaný povrch, háčik</Text>
                </Box>
              </Flex>
            </Box>
            <Box color="light">
              <Flex wrap="wrap">
                <Text fontSize="2xl" mb={8} mr={6} fontWeight="medium">Od 9,75 € / kus</Text>
                <Button color="light" bgColor="transparent" border="2px" borderColor="light" p={5} fontSize="lg" _hover={{backgroundColor: "light", borderColor: "transparent", color: "yellow.800"}}>Dozvedieť sa viac <ChevronRightIcon w="7" h="7" /></Button>
              </Flex>
            </Box>
          </Container>
        </Box>

        <Box bgImage="url('../../platno.png')" bgPosition="center" bgRepeat="no-repeat" bgSize="cover" bgAttachment="fixed" py={80}>
          <Container maxW="container.lg">
            <Box color="light">
              <Heading size="3xl" mb={8}>
                Plátna
              </Heading>
              <Text fontSize="xl" mb={4} fontWeight="medium">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</Text>
              
              <Box mb={8}>
                <Flex alignItems="center" wrap="wrap">
                  <Text fontSize="lg" fontWeight="medium" mr={8}><FontAwesomeIcon icon={faExpandAlt} size="sm" /> 20x30 cm - 100x150 cm</Text>
                  <Text fontSize="lg" fontWeight="medium" mr={8}><FontAwesomeIcon icon={faLayerGroup} size="sm" /> rôzne povrchy</Text>
                  <Text fontSize="lg" fontWeight="medium" mr={8}><FontAwesomeIcon icon={faSortAmountUp} size="sm" /> 340 g/m<sup>2</sup></Text>
                  <Text fontSize="lg" fontWeight="medium" mr={8}><FontAwesomeIcon icon={faThumbtack} size="sm" /> s napínacimi kolíkmi</Text>
                </Flex>
              </Box>

              <Button bgColor="transparent" border="2px" borderColor="light" p={5} fontSize="lg" _hover={{backgroundColor: "light", borderColor: "transparent", color: "magenta.500"}}>Dozvedieť sa viac <ChevronRightIcon w="7" h="7" /></Button>
            </Box>
          </Container>
        </Box>

        <Box bgImage="url('../../magnetka.png')" bgPosition="center" bgRepeat="no-repeat" bgSize="cover" bgAttachment="fixed" py={80}>
          <Container maxW="container.lg">
            <Box color="light">
              <Heading size="3xl" mb={8}>
                Magnetky
              </Heading>
              <Text fontSize="xl" mb={4} fontWeight="medium">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</Text>
              
              <Box mb={6} bgColor="light" color="dark.500" py={2} px={5} borderRadius="md">
                <Flex alignItems="center" wrap="wrap">
                  <Box mr={4}>
                    <Text fontWeight="medium" color="dark.300"><FontAwesomeIcon icon={faExpandAlt} size="xs" /> Rozmer</Text>
                    <Text fontSize="lg" fontWeight="medium">9x13 cm - 100x150 cm</Text>
                  </Box>
                  <hr style={{border: 'none', borderLeft: '1px solid #B8B8B8', height: '40px', width: '10px'}} />
                  <Box mr={4} ml={2}>
                    <Text fontWeight="medium" color="dark.300"><FontAwesomeIcon icon={faLayerGroup} size="xs" /> Povrch</Text>
                    <Text fontSize="lg" fontWeight="medium">lesklý / matný</Text>
                  </Box>
                  <hr style={{border: 'none', borderLeft: '1px solid #B8B8B8', height: '40px', width: '10px'}} />
                  <Box mr={4} ml={2}>
                    <Text fontWeight="medium" color="dark.300"><FontAwesomeIcon icon={faSortAmountUp} size="xs" /> Gramáž</Text>
                    <Text fontSize="lg" fontWeight="medium">250 g/m<sup>2</sup></Text>
                  </Box>
                  <hr style={{border: 'none', borderLeft: '1px solid #B8B8B8', height: '40px', width: '10px'}} />
                  <Box ml={2}>
                    <Text fontWeight="medium" color="dark.300"><FontAwesomeIcon icon={faTint} size="xs" /> Farby</Text>
                    <Text fontSize="lg" fontWeight="medium">verné podanie farieb</Text>
                  </Box>
                  
                  <Spacer />

                  <Button bgColor="transparent" border="2px" borderColor="light" p={5} fontSize="lg" _hover={{backgroundColor: "light", borderColor: "transparent", color: "blue.500"}}>Dozvedieť sa viac <ChevronRightIcon w="7" h="7" /></Button>
                </Flex>
              </Box>

              <Button bgColor="transparent" border="2px" borderColor="light" p={5} fontSize="lg" _hover={{backgroundColor: "light", borderColor: "transparent", color: "dark.500"}}>Dozvedieť sa viac <ChevronRightIcon w="7" h="7" /></Button>
            </Box>
          </Container>
        </Box>

      </ChakraProvider>
    </main>
  )
}

export default IndexPage
