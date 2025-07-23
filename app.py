import streamlit as st
import requests
import py3Dmol

st.set_page_config(page_title="PharmaScope", layout="wide")

st.title("PharmaScope: Drug Comparison & Interaction Explorer")

# --- Helper Functions ---
def get_drug_info(drug_name):
    url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{drug_name}/JSON"
    res = requests.get(url)
    if not res.ok:
        return None
    data = res.json()
    compound = data.get('PC_Compounds', [{}])[0]
    props = compound.get('props', [])
    def find_prop(label):
        for p in props:
            if p.get('urn', {}).get('label') == label:
                return p.get('value', {}).get('sval') or p.get('value', {}).get('fval')
        return ''
    return {
        'brandName': drug_name,
        'iupacName': find_prop('IUPAC Name'),
        'formula': find_prop('Molecular Formula'),
        'weight': str(find_prop('Molecular Weight')),
        'description': '',
        'drugClass': '',
        'indications': '',
        'sideEffects': '',
    }

def get_drug_sdf(drug_name):
    url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{drug_name}/SDF"
    res = requests.get(url)
    if not res.ok:
        return None
    return res.text

def get_drug_interaction(drug1, drug2):
    url = f"https://rxnav.nlm.nih.gov/REST/interaction/list.json?names={drug1}+{drug2}"
    res = requests.get(url)
    if not res.ok:
        return {'description': 'Interaction API error', 'severity': 'error', 'explanation': ''}
    data = res.json()
    try:
        pair = data['fullInteractionTypeGroup'][0]['fullInteractionType'][0]['interactionPair'][0]
        return {
            'description': pair.get('description', ''),
            'severity': pair.get('severity', ''),
            'explanation': pair.get('clinicalEffect', ''),
        }
    except Exception:
        return {'description': 'No known interaction.', 'severity': 'none', 'explanation': ''}

# --- Session State ---
if 'compare_list' not in st.session_state:
    st.session_state['compare_list'] = []
if 'selected_drug' not in st.session_state:
    st.session_state['selected_drug'] = None
if 'search' not in st.session_state:
    st.session_state['search'] = ''

# --- Sidebar: Drug Search and Comparison List ---
st.sidebar.header("Search & Compare Drugs")
search_query = st.sidebar.text_input("Search for a drug...", value=st.session_state['search'], key="search_input")
if st.sidebar.button("Search", key="search_btn"):
    st.session_state['search'] = search_query
    info = get_drug_info(search_query)
    if info:
        st.session_state['selected_drug'] = info
    else:
        st.session_state['selected_drug'] = None

# Add to comparison list and clear search bar
if st.session_state['selected_drug']:
    st.sidebar.markdown(f"**Selected Drug:** {st.session_state['selected_drug'].get('brandName') or st.session_state['selected_drug'].get('iupacName')}")
    if st.sidebar.button("Add to Comparison List", key="add_btn"):
        if st.session_state['selected_drug'] not in st.session_state['compare_list']:
            st.session_state['compare_list'].append(st.session_state['selected_drug'])
        st.session_state['selected_drug'] = None
        st.session_state['search'] = ''
        st.experimental_rerun()

st.sidebar.markdown("---")
st.sidebar.subheader("Comparison List")
for idx, drug in enumerate(st.session_state['compare_list']):
    highlight = "**" if st.session_state.get('selected_drug') and drug == st.session_state['selected_drug'] else ""
    with st.sidebar.expander(f"{highlight}{drug.get('brandName') or drug.get('iupacName') or f'Drug {idx+1}'}{highlight}"):
        st.write(f"**IUPAC:** {drug.get('iupacName','')}")
        st.write(f"**Formula:** {drug.get('formula','')}")
        st.write(f"**Weight:** {drug.get('weight','')}")
        if st.sidebar.button(f"Remove {drug.get('brandName') or drug.get('iupacName') or idx}", key=f"remove_{idx}"):
            st.session_state['compare_list'].pop(idx)
            st.experimental_rerun()

# --- Main Area: Drug Details, Interaction, 3D Viewer ---
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("Drug Details")
    drug = st.session_state['selected_drug']
    if not drug and st.session_state['compare_list']:
        drug = st.session_state['compare_list'][-1]  # Show last added drug if nothing selected
    if drug:
        st.markdown(f"""
        **Brand Name:** {drug.get('brandName','')}
        
        **IUPAC:** {drug.get('iupacName','')}
        
        **Formula:** {drug.get('formula','')}
        
        **Molecular Weight:** {drug.get('weight','')}
        
        **Description:** {drug.get('description','')}
        
        **Class:** {drug.get('drugClass','')}
        
        **Indications:** {drug.get('indications','')}
        
        **Side Effects:** {drug.get('sideEffects','')}
        """)
    else:
        st.info("Enter a drug name to see details.")

    st.subheader("Drug Interaction Results")
    if len(st.session_state['compare_list']) >= 2:
        d1 = st.session_state['compare_list'][0]['brandName']
        d2 = st.session_state['compare_list'][1]['brandName']
        with st.spinner("Checking interaction..."):
            interaction = get_drug_interaction(d1, d2)
        st.write(f"**Description:** {interaction['description']}")
        st.write(f"**Severity:** {interaction['severity']}")
        if interaction['explanation']:
            st.write(f"**Explanation:** {interaction['explanation']}")
    else:
        st.info("Select two drugs to check for interactions.")

with col2:
    st.subheader("3D Molecule Viewer")
    sdf1 = sdf2 = None
    label1 = label2 = None
    drug = st.session_state['selected_drug']
    if not drug and st.session_state['compare_list']:
        drug = st.session_state['compare_list'][-1]
    if drug:
        with st.spinner("Loading 3D structure..."):
            sdf1 = get_drug_sdf(drug['brandName'])
            label1 = drug['brandName']
    if len(st.session_state['compare_list']) >= 2:
        with st.spinner("Loading 3D structure for comparison drug..."):
            sdf2 = get_drug_sdf(st.session_state['compare_list'][1]['brandName'])
            label2 = st.session_state['compare_list'][1]['brandName']
    if sdf1:
        view = py3Dmol.view(width=300, height=300)
        view.addModel(sdf1, 'sdf')
        view.setStyle({'stick': {'color': 'blue'}, 'sphere': {'scale': 0.3, 'color': 'blue'}})
        view.zoomTo()
        view.zoom(1.2, 1000)
        view.render()
        st.components.v1.html(view._make_html(), height=320)
        st.caption(label1)
    if sdf2:
        view2 = py3Dmol.view(width=300, height=300)
        view2.addModel(sdf2, 'sdf')
        view2.setStyle({'stick': {'color': 'red'}, 'sphere': {'scale': 0.3, 'color': 'red'}})
        view2.zoomTo()
        view2.zoom(1.2, 1000)
        view2.render()
        st.components.v1.html(view2._make_html(), height=320)
        st.caption(label2)
    if not sdf1 and not sdf2:
        st.info("Enter a drug name to view its molecule.")

# --- Custom CSS for look & feel (optional, to be expanded) ---
st.markdown(
    """
    <style>
    .stButton>button {background-color: #2563eb; color: white; border-radius: 6px;}
    .stTextInput>div>input {border-radius: 6px; border: 1px solid #d1d5db;}
    .stSidebar .stButton>button {background-color: #2563eb; color: white; border-radius: 6px;}
    .stSidebar .stTextInput>div>input {border-radius: 6px; border: 1px solid #d1d5db;}
    </style>
    """,
    unsafe_allow_html=True,
) 
