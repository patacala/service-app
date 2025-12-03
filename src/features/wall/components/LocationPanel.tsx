import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  Keyboard
} from 'react-native';
import { Box } from '@/design-system/components/layout/Box';
import { Typography } from '@/design-system/components/foundation/Typography';
import { Icon } from '@/design-system/components/layout/Icon';
import { Row } from '@/design-system/components/layout/Row/Row';
import { theme, Input, BottomModal } from '@/design-system';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchLocations, addRecentLocation, setInitialRecentLocations } from '@/features/wall/slices/wall.slice';

interface Location {
  id: string;
  name: string;
}

interface LocationPanelProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: Location) => void;
  currentLocation: Location;
}

export const LocationPanel: React.FC<LocationPanelProps> = ({
  visible,
  onClose,
  onSelectLocation,
  currentLocation
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const allStates = useSelector((state: RootState) => state.wall.locations);
  const recentLocations = useSelector((state: RootState) => state.wall.recentLocations);

  // Estado para la búsqueda - Inicializamos con la ubicación actual
  const [searchQuery, setSearchQuery] = useState(currentLocation.name);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Obtener locaciones cuando el componente se monta
  useEffect(() => {
    if (allStates.length === 0) {
      dispatch(fetchLocations());
    }
    // Inicializar locaciones recientes si están vacías
    if (recentLocations.length === 0) {
      dispatch(setInitialRecentLocations());
    }
  }, [dispatch, allStates.length, recentLocations.length]);
  
  // Actualizar searchQuery cuando cambia currentLocation o cuando el modal se hace visible
  useEffect(() => {
    if (visible) {
      setSearchQuery(currentLocation.name);
      setIsSearchActive(false);
      setSearchResults([]);
    }
  }, [visible, currentLocation]);

  // Manejar la búsqueda de ubicaciones
  useEffect(() => {
    // No filter when showing the current location initially
    if (searchQuery === currentLocation.name && !isSearchActive) {
      return;
    }
    
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearchActive(false);
      return;
    }

    setIsSearchActive(true);
    const query = searchQuery.toLowerCase();
    const results = allStates.filter(
      (      location: { name: string; }) => location.name.toLowerCase().includes(query)
    );
    setSearchResults(results);
  }, [searchQuery, currentLocation.name, isSearchActive, allStates]);

  // Función para manejar cambios en la búsqueda
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setIsSearchActive(true);
  };

  // Función para manejar el enfoque en el campo de búsqueda
  const handleInputFocus = () => {
    // Seleccionar todo el texto para facilitar la nueva búsqueda
    setIsSearchActive(true);
  };

  // Función para manejar la selección de ubicación
  const handleLocationSelect = (item: Location) => {
    // Agregar a ubicaciones recientes
    dispatch(addRecentLocation(item));
    
    // Ocultar el teclado explícitamente
    Keyboard.dismiss();
    
    // Pequeño timeout para asegurar que se complete la selección
    // después de que se oculte el teclado
    setTimeout(() => {
      onSelectLocation(item);
      onClose();
    }, 50);
  };

  // Renderizar cada elemento de la lista de ciudades
  const renderLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity 
      style={styles.cityItem}
      onPress={() => handleLocationSelect(item)}
      activeOpacity={0.7} // Feedback visual más claro
    >
      <Typography 
        variant="bodyMedium" 
        color={theme.colors.colorBaseWhite}
      >
        {item.name}
      </Typography>
      {currentLocation.name === item.name && (
        <Icon name="star" size={20} color="colorBaseWhite" />
      )}
    </TouchableOpacity>
  );

  // Renderizar cada elemento de la lista de ciudades recientes
  const renderRecentLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity 
      style={styles.cityItem}
      onPress={() => handleLocationSelect(item)}
      activeOpacity={0.7} // Feedback visual más claro
    >
      <Typography 
        variant="bodyMedium" 
        color={theme.colors.colorBaseWhite}
      >
        {item.name}
      </Typography>
      {/* SIEMPRE mostrar el icono para ciudades recientes */}
      <Icon name="star" size={20} color="colorBaseWhite" />
    </TouchableOpacity>
  );

  // Componente separador para la lista
  const ItemSeparator = () => <Box style={styles.separator} />;

  return (
    <BottomModal
      visible={visible}
      onClose={onClose}
      title="Your location"
      enableScroll={true}
    >
      <Box style={styles.content}>
        {/* Sección de ubicación actual */}
        <Box marginTop="xs">
          <Row alignItems="center" marginBottom="xs">
            <Icon name="location" size={24} color="colorBaseWhite" />
            <Box marginLeft="xs">
              <Typography variant="bodyLarge" color={theme.colors.colorBaseWhite}>
                Current Location
              </Typography>
            </Box>
          </Row>
          
          <Typography 
            variant="bodyMedium" 
            color={theme.colors.colorGrey200}
            style={styles.locationDescription}
          >
           We&apos;ve set your location in real-time, but feel free to switch it if you&apos;d like to explore workers in another area
          </Typography>
          
          {/* Campo de búsqueda usando el componente Input con valor inicial */}
          <Box marginTop="xs">
            <Input 
              placeholder="Search location"
              variant="search"
              icon="transfer"
              style={styles.inputSearch}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={handleInputFocus}
              autoCapitalize="none"
              selectTextOnFocus={true}
            />
          </Box>
        </Box>
        
        {/* Lista de resultados o ciudades recientes */}
        <Box marginTop="md">
          {isSearchActive ? (
            <>
              <Typography 
                variant="bodyMedium" 
                color={theme.colors.colorGrey200}
                style={styles.sectionTitle}
              >
                Results
              </Typography>
              
              {searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id}
                  renderItem={renderLocationItem}
                  scrollEnabled={false}
                  ItemSeparatorComponent={ItemSeparator}
                  style={styles.locationList}
                  keyboardShouldPersistTaps="always"
                />
              ) : (
                <Typography 
                  variant="bodyMedium" 
                  color={theme.colors.colorGrey400}
                  style={styles.noResultsText}
                >
                  No locations found
                </Typography>
              )}
            </>
          ) : (
            <>
              <Typography 
                variant="bodyMedium" 
                color={theme.colors.colorGrey200}
                style={styles.sectionTitle}
              >
                Recent cities
              </Typography>
              
              {recentLocations.length > 0 ? (
                <FlatList
                  data={recentLocations}
                  keyExtractor={(item) => item.id}
                  renderItem={renderRecentLocationItem} // Usando el nuevo renderItem para recientes
                  scrollEnabled={false}
                  ItemSeparatorComponent={ItemSeparator}
                  style={styles.locationList}
                  keyboardShouldPersistTaps="always"
                />
              ) : (
                <Typography 
                  variant="bodyMedium" 
                  color={theme.colors.colorGrey400}
                  style={styles.noResultsText}
                >
                  No recent cities
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  icon: {
    marginRight: 10,
  },
  locationDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  inputSearch: {
    height: 56
  },
  sectionTitle: {
    marginBottom: 12,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.colorGrey600,
  },
  locationList: {
    width: '100%',
  },
  noResultsText: {
    paddingVertical: 16,
    fontStyle: 'italic',
  }
});