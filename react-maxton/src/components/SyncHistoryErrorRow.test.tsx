import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SyncHistoryErrorRow } from './SyncHistoryErrorRow';

describe('SyncHistoryErrorRow', () => {
  it('renders error message when errorMessage is provided', () => {
    render(
      <table><tbody>
        <SyncHistoryErrorRow
          colSpan={5}
          errorMessage="Connection refused"
          warningMessage={null}
        />
      </tbody></table>
    );
    expect(screen.getByText(/Connection refused/i)).toBeInTheDocument();
    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });

  it('renders warning message when warningMessage is provided and errorMessage is null', () => {
    render(
      <table><tbody>
        <SyncHistoryErrorRow
          colSpan={5}
          errorMessage={null}
          warningMessage="All records were duplicates"
        />
      </tbody></table>
    );
    expect(screen.getByText(/All records were duplicates/i)).toBeInTheDocument();
    expect(screen.getByText(/Warning/i)).toBeInTheDocument();
  });

  it('renders nothing if both messages are null', () => {
    const { container } = render(
      <table><tbody>
        <SyncHistoryErrorRow
          colSpan={5}
          errorMessage={null}
          warningMessage={null}
        />
      </tbody></table>
    );
    expect(container.querySelector('tr')).toBeNull();
  });
});
