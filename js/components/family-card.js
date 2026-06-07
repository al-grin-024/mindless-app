/**
 * FamilyCard – Family member display card
 * Shows avatar, name, role, and action buttons
 */

import { t } from '../i18n.js';

/**
 * Create a family member card
 * @param {Object} member
 * @param {string} member.id - Unique member ID
 * @param {string} member.name - Member display name
 * @param {string} [member.role] - Role label (e.g. 'parent', 'child')
 * @param {string} [member.avatar] - Avatar URL or empty for initials
 * @param {string} [member.color] - Background color for the card accent
 * @param {Object} [options]
 * @param {Function} [options.onEdit] - Callback when edit is tapped
 * @param {Function} [options.onRemove] - Callback when remove is tapped
 * @returns {HTMLElement}
 */
export function FamilyCard(member, { onEdit, onRemove } = {}) {
  const card = document.createElement('article');
  card.id = `family-${member.id}`;
  card.className = 'card family-card';
  card.setAttribute('role', 'listitem');

  // Generate initials from name
  const initials = member.name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const accentColor = member.color || '#C3B1E1';
  const roleLabel = member.role ? t(`family.role.${member.role}`) : '';

  card.innerHTML = `
    <div class="family-card__avatar avatar" 
         style="background: ${accentColor}20; color: ${accentColor}">
      ${member.avatar
        ? `<img src="${member.avatar}" alt="${member.name}" class="family-card__photo" />`
        : `<span class="family-card__initials">${initials}</span>`
      }
    </div>
    <div class="family-card__info">
      <h3 class="family-card__name">${member.name}</h3>
      ${roleLabel ? `<span class="family-card__role text-caption">${roleLabel}</span>` : ''}
    </div>
    <div class="family-card__actions">
      ${onEdit ? `
        <button class="btn btn-icon family-card__edit" id="edit-member-${member.id}" type="button"
                aria-label="${t('family.editMember')}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      ` : ''}
      ${onRemove ? `
        <button class="btn btn-icon family-card__remove" id="remove-member-${member.id}" type="button"
                aria-label="${t('family.removeMember')}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      ` : ''}
    </div>
  `;

  // Bind action handlers
  if (onEdit) {
    card.querySelector(`#edit-member-${member.id}`).addEventListener('click', () => onEdit(member));
  }
  if (onRemove) {
    card.querySelector(`#remove-member-${member.id}`).addEventListener('click', () => onRemove(member));
  }

  return card;
}
