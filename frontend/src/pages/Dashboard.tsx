import Container from '../components/shared/Container';
import ItemList from '../features/items/ItemList';
import RentalList from '../features/rentals/RentalList';
import Section from '../components/shared/Section';

export default function Dashboard() {
  return (
    <Container>
      <Section title="Mis alquileres">
        <RentalList />
      </Section>

      <Section title="Catálogo público">
        <ItemList />
      </Section>
    </Container>
  );
}
