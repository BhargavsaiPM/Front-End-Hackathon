import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './UserPages.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchResources = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await api.get('/api/resources', { params });
      setResources(response.data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      online_resource: 'Online Resource',
      helpline: 'Helpline',
      legal_info: 'Legal Information',
      health_info: 'Health Information'
    };
    return labels[type] || type;
  };

  const handleCallClick = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="resources-page">
      <h1>Resources & Support</h1>
      
      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'helpline' ? 'active' : ''}
          onClick={() => setFilter('helpline')}
        >
          Helplines
        </button>
        <button 
          className={filter === 'online_resource' ? 'active' : ''}
          onClick={() => setFilter('online_resource')}
        >
          Articles
        </button>
        <button 
          className={filter === 'legal_info' ? 'active' : ''}
          onClick={() => setFilter('legal_info')}
        >
          Legal Info
        </button>
        <button 
          className={filter === 'health_info' ? 'active' : ''}
          onClick={() => setFilter('health_info')}
        >
          Health Info
        </button>
      </div>

      {loading ? (
        <p>Loading resources...</p>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <p>No resources found in this category.</p>
        </div>
      ) : (
        <div className="resources-list">
          {resources.map(resource => (
            <div key={resource.id} className="resource-card">
              <div className="resource-header">
                <h3>{resource.title}</h3>
                <span className="resource-type">{getTypeLabel(resource.type)}</span>
              </div>
              {resource.description && (
                <p className="resource-description">{resource.description}</p>
              )}
              {resource.category && (
                <p className="resource-category">Category: {resource.category}</p>
              )}
              {resource.type === 'helpline' ? (
                <div className="resource-action">
                  <button 
                    className="btn-call"
                    onClick={() => handleCallClick(resource.link_or_number)}
                  >
                    📞 Call {resource.link_or_number}
                  </button>
                  <button 
                    className="btn-copy"
                    onClick={() => {
                      navigator.clipboard.writeText(resource.link_or_number);
                      alert('Number copied to clipboard');
                    }}
                  >
                    Copy Number
                  </button>
                </div>
              ) : (
                <a 
                  href={resource.link_or_number} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-link"
                >
                  Visit Resource →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;

