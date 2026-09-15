import { render, screen, fireEvent } from '@testing-library/react';
import RecipientInput, { Recipient } from '../RecipientInput';

const users = [{ id: 'u1', name: 'Alice', email: 'alice@x.com' }];

describe('RecipientInput', () => {
  test('add valid email', () => {
    let val: Recipient[] = [];
    const { rerender } = render(<RecipientInput value={val} onChange={(v) => { val = v; }} users={users} />);
    fireEvent.change(screen.getByLabelText('Add recipient'), { target: { value: 'bob@x.com' } });
    fireEvent.click(screen.getByText('Add'));
    expect(val).toEqual([{ kind: 'email', address: 'bob@x.com' }]);
  });

  test('add user by exact name', () => {
    let val: Recipient[] = [];
    render(<RecipientInput value={val} onChange={(v) => { val = v; }} users={users} />);
    fireEvent.change(screen.getByLabelText('Add recipient'), { target: { value: 'Alice' } });
    fireEvent.click(screen.getByText('Add'));
    expect(val).toEqual([{ kind: 'user', id: 'u1' }]);
  });

  test('add user by email address', () => {
    let val: Recipient[] = [];
    render(<RecipientInput value={val} onChange={(v) => { val = v; }} users={users} />);
    fireEvent.change(screen.getByLabelText('Add recipient'), { target: { value: 'alice@x.com' } });
    fireEvent.click(screen.getByText('Add'));
    expect(val).toEqual([{ kind: 'user', id: 'u1' }]);
  });

  test('invalid input shows error and does not call onChange', () => {
    let val: Recipient[] = [];
    let changeCount = 0;
    render(
      <RecipientInput
        value={val}
        onChange={(v) => {
          val = v;
          changeCount++;
        }}
        users={users}
      />
    );
    fireEvent.change(screen.getByLabelText('Add recipient'), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByText('Add'));
    expect(changeCount).toBe(0);
    expect(val).toEqual([]);
    expect(screen.getByText('Enter a valid email or a user name')).toBeInTheDocument();
  });

  test('clicking remove button on chip removes recipient', () => {
    const initialVal: Recipient[] = [{ kind: 'email', address: 'bob@x.com' }];
    let val = initialVal;
    const { rerender } = render(
      <RecipientInput value={val} onChange={(v) => { val = v; }} users={users} />
    );
    const removeButton = screen.getByLabelText('Remove bob@x.com');
    fireEvent.click(removeButton);
    rerender(<RecipientInput value={val} onChange={(v) => { val = v; }} users={users} />);
    expect(val).toEqual([]);
  });

  test('adding same email with different case results in single chip', () => {
    let val: Recipient[] = [];
    const { rerender } = render(
      <RecipientInput value={val} onChange={(v) => { val = v; }} users={users} />
    );
    fireEvent.change(screen.getByLabelText('Add recipient'), { target: { value: 'bob@x.com' } });
    fireEvent.click(screen.getByText('Add'));
    rerender(<RecipientInput value={val} onChange={(v) => { val = v; }} users={users} />);

    fireEvent.change(screen.getByLabelText('Add recipient'), { target: { value: 'BOB@X.COM' } });
    fireEvent.click(screen.getByText('Add'));
    rerender(<RecipientInput value={val} onChange={(v) => { val = v; }} users={users} />);

    expect(val).toHaveLength(1);
    expect(val[0]).toEqual({ kind: 'email', address: 'bob@x.com' });
  });

  test('displays no recipients message when empty', () => {
    render(<RecipientInput value={[]} onChange={() => {}} users={users} />);
    expect(screen.getByText('No recipients yet')).toBeInTheDocument();
  });

  test('displays user name in chip when user is added', () => {
    const val: Recipient[] = [{ kind: 'user', id: 'u1' }];
    render(<RecipientInput value={val} onChange={() => {}} users={users} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  test('displays email in chip when email is added', () => {
    const val: Recipient[] = [{ kind: 'email', address: 'bob@x.com' }];
    render(<RecipientInput value={val} onChange={() => {}} users={users} />);
    expect(screen.getByText('bob@x.com')).toBeInTheDocument();
  });

  test('enter key in input field triggers add', () => {
    let val: Recipient[] = [];
    render(<RecipientInput value={val} onChange={(v) => { val = v; }} users={users} />);
    const input = screen.getByLabelText('Add recipient') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'bob@x.com' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(val).toEqual([{ kind: 'email', address: 'bob@x.com' }]);
  });

  test('case-insensitive user name match', () => {
    let val: Recipient[] = [];
    render(<RecipientInput value={val} onChange={(v) => { val = v; }} users={users} />);
    fireEvent.change(screen.getByLabelText('Add recipient'), { target: { value: 'alice' } });
    fireEvent.click(screen.getByText('Add'));
    expect(val).toEqual([{ kind: 'user', id: 'u1' }]);
  });

  test('empty input does not add anything', () => {
    let val: Recipient[] = [];
    let changeCount = 0;
    render(
      <RecipientInput
        value={val}
        onChange={(v) => {
          val = v;
          changeCount++;
        }}
        users={users}
      />
    );
    fireEvent.change(screen.getByLabelText('Add recipient'), { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Add'));
    expect(changeCount).toBe(0);
    expect(val).toEqual([]);
  });
});
