import {render, fireEvent} from '@testing-library/react-native';
import Auth from '../index';
import {ThemeProvider} from '../../../design-system/theme/ThemeProvider';

describe('Auth Component', () => {
  it('renders correctly', () => {
    const {getByText} = render(
      <ThemeProvider>
        <Auth />
      </ThemeProvider>,
    );

    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Signup')).toBeTruthy();
  });

  it('changes language on button press', () => {
    const {getByText} = render(
      <ThemeProvider>
        <Auth />
      </ThemeProvider>,
    );

    fireEvent.press(getByText('Change to Español'));
    // Add assertions to check if the language changed
  });
});
