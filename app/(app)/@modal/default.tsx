// Parallel route default: nothing to render when the modal slot isn't
// actively intercepted (i.e. on every route except an in-app navigation
// to a title detail page).
export default function Default() {
  return null;
}
